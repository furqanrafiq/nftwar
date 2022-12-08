import { Button, Input, Statistic, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import whitelistAddresses from '../addresses/WhitelistAddresses.json'
const { Countdown } = Statistic;
const { Option } = Select;
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const ContractPaused = ({ totalSupply, maxSupply, contract, currentAccount, getTotalSupply }) => {

    return (
        <div>
            <div className='mb-3'>
                <p className='color-white'>Address:</p>
                <p className='color-white mb-2'>{currentAccount.slice(0, 6) + '...' + currentAccount.slice(-6)}</p>
                <p className='color-blue'>Contract Paused</p>
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
                        <p className='color-gray'>Paused</p>
                    </div>
                </div>
                <div className='d-flex justify-content-between align-items-baseline'>
                    <div>
                        <p className='color-gray'>0.015 ETH - Public</p>
                    </div>
                    <div>
                        <p className='color-gray'>Paused</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContractPaused