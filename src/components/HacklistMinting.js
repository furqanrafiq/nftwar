import { Button, Input, Statistic, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import whitelistAddresses from '../addresses/WhitelistAddresses.json'
const { Countdown } = Statistic;
const { Option } = Select;
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const HacklistMinting = ({ totalSupply, maxSupply, contract, currentAccount, getTotalSupply }) => {
    const [deadline, setDeadline] = useState();
    const date = "2022-09-06T00:00";
    const [publicMintCost, setPublicMintCost] = useState(0)
    const [quantity, setQuantity] = useState(1);
    const [balanceOf, setBalanceOf] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isWhitelisted, setIsWhitelisted] = useState(Boolean)
    const [merkleProof, setMerkleProof] = useState('');
    const [mintPerTxn, setMintPerTxn] = useState(0)
    const [mintPerWallet, setMintPerWallet] = useState(0)

    useEffect(() => {
        const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const tempVar = keccak256(currentAccount);
        const claimingAddress = tempVar;
        const rootHash = merkleTree.getHexRoot();
        const hexProof = merkleTree.getHexProof(claimingAddress);
        setMerkleProof(hexProof)
        const verify = merkleTree.verify(hexProof, claimingAddress, rootHash)
        if (verify == true) {
            setIsWhitelisted(true)
            message.success('Wallet whitelisted')
        } else {
            setIsWhitelisted(false)
            message.error('Wallet not whitelisted')
        }
    }, [currentAccount])

    async function getPublicMintCost() {
        const cost = await contract.methods.cost().call();
        setPublicMintCost(cost)
        const perTxn = await contract.methods.MAX_PER_Transaction_WL().call();
        setMintPerTxn(perTxn)
        const perWallet = await contract.methods.MAX_PER_Wallet_WL().call();
        setMintPerWallet(perWallet)
    }

    useEffect(() => {
        getPublicMintCost()
    }, [])

    function handleWlMint() {
        setLoading(true)
        contract.methods.mintWhitelist(merkleProof, quantity).send({
            from: currentAccount,
            value: 0 * 10 ** 18
        }).then(resp => {
            setLoading(false)
            message.success('Minted Successfully');
            getTotalSupply()
        })
            .catch(err => {
                message.error(err.message);
                getTotalSupply()
                setLoading(false)
            })
    }

    return (
        <div>
            <div className='mb-3'>
                <p className='color-white'>Address:</p>
                <p className='color-white mb-2'>{currentAccount.slice(0, 6) + '...' + currentAccount.slice(-6)}</p>
                <p className='color-blue'>Hacklist minting</p>
            </div>
            <div className='mb-3'>
                <p className='color-white' style={{ fontSize: "22px" }}>{totalSupply}/{maxSupply} minted</p>
            </div>
            <div className='mb-3'>
                <div className='d-flex justify-content-between mb-2'>
                    <div>
                        <p className='color-blue'>Free - Hacklist</p>
                    </div>
                    <div>
                        <p className='color-red'>Live</p>
                    </div>
                </div>
                <div className='d-flex justify-content-between align-items-baseline'>
                    <div>
                        <p className='color-white'>0.015 ETH - Public</p>
                    </div>
                    <div>
                        <Countdown className='count-down-gray' value={moment(date)} />
                    </div>
                </div>
            </div>
            <div className='mb-3'>
                <Select className='w-100' value={quantity} onChange={(e) => setQuantity(e)}>
                    <Option value={1}>1</Option>
                </Select>
            </div>
            <div>
                <p className='color-white mb-2'>{mintPerTxn} per TXN , {mintPerWallet} per Wallet</p>
                <Button loading={loading} disabled={isWhitelisted == false} onClick={() => handleWlMint()}>
                    {
                        loading == true ?
                            'Minting' :
                            'Mint now'
                    }
                </Button>
            </div>
        </div>
    )
}

export default HacklistMinting