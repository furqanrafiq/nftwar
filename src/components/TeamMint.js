import { Button, Input, Statistic, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
// import whitelistAddresses from '../addresses/WhitelistAddresses.json'
import teamAddresses from '../addresses/TeamWalletAddresses.json'
const { Countdown } = Statistic;
const { Option } = Select;
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');


const TeamMint = ({ totalSupply, maxSupply, contract, currentAccount, getTotalSupply }) => {
    const [publicMintCost, setPublicMintCost] = useState(0)
    const [quantity, setQuantity] = useState(1);
    const [balanceOf, setBalanceOf] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isWhitelisted, setIsWhitelisted] = useState(Boolean)
    const [merkleRoot, setMerkeRoot] = useState('');
    const [teamMintPerWallet, setTeamMintPerWallet] = useState(0)

    useEffect(() => {
        const leafNodes = teamAddresses.map(addr => keccak256(addr));
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const tempVar = keccak256(currentAccount);
        const claimingAddress = tempVar;
        const rootHash = merkleTree.getHexRoot();
        const hexProof = merkleTree.getHexProof(claimingAddress);
        setMerkeRoot(hexProof)
        const hexProofJoined = hexProof.join(",")
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
        const teamMintPerWallet = await contract.methods.team_q().call();
        setTeamMintPerWallet(teamMintPerWallet)
        const cost = await contract.methods.cost().call();
        setPublicMintCost(cost)
    }

    useEffect(() => {
        getPublicMintCost()
    }, [])

    function handleTeamMint() {
        setLoading(true)
        contract.methods.mintTeam(merkleRoot).send({
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
                <p className='color-blue'>Team mint</p>
            </div>
            <div className='mb-3'>
                <p className='color-white' style={{ fontSize: "22px" }}>{totalSupply}/{maxSupply} minted</p>
            </div>
            <div>
                <p className='color-white mb-2'>{teamMintPerWallet} per Wallet</p>
                <Button loading={loading} disabled={isWhitelisted == false} onClick={() => handleTeamMint()}>
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

export default TeamMint