import { Button, Input, Statistic, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
const { Countdown } = Statistic;
const { Option } = Select;


const PublicMint = ({ totalSupply, maxSupply, contract, currentAccount, getTotalSupply }) => {
    const [deadline, setDeadline] = useState();
    const date = "2022-09-06T00:00";
    const [publicMintCost, setPublicMintCost] = useState(0)
    const [quantity, setQuantity] = useState(1);
    const [balanceOf, setBalanceOf] = useState(0);
    const [loading, setLoading] = useState(false);
    const [publicMintPerTxn, setPublicMintPerTxn] = useState(0);

    async function getPublicMintCost() {
        const mintPerTxn = await contract.methods.MAX_PER_Transaction().call();
        setPublicMintPerTxn(mintPerTxn)
        const cost = await contract.methods.cost().call();
        setPublicMintCost(cost)
    }

    useEffect(() => {
        getPublicMintCost()
    }, [])

    function handlePublicMint() {
        setLoading(true)
        contract.methods.mint(quantity).send({
            from: currentAccount,
            value: publicMintCost * quantity
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
                <p className='color-blue'>Public minting</p>
            </div>
            <div className='mb-3'>
                <p className='color-white' style={{ fontSize: "22px" }}>{totalSupply}/{maxSupply} minted</p>
            </div>
            <div className='mb-3'>
                <div className='d-flex justify-content-between mb-2'>
                    <div>
                        <p className='color-gray'>Free - Hacklist</p>
                    </div>
                    <div>
                        <p className='color-gray'>Finished</p>
                    </div>
                </div>
                <div className='d-flex justify-content-between align-items-baseline'>
                    <div>
                        <p className='color-blue'>{publicMintCost / (10 ** 18)} ETH - Public</p>
                    </div>
                    <div>
                        <Countdown className='count-down-red' value={moment(date)} />
                    </div>
                </div>
            </div>
            <div className='mb-3'>
                <Select className='w-100' value={quantity} onChange={(e) => setQuantity(e)}>
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                </Select>
            </div>
            <div>
                <p className='color-white mb-2'>{publicMintPerTxn} per TXN</p>
                <Button loading={loading} onClick={() => handlePublicMint()}>
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

export default PublicMint