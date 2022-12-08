import { Button, Input, message } from 'antd'
import React, { useState } from 'react'

const ConnectWallet = ({ connectWalletHandler }) => {

    return (
        <div>
            <Button onClick={() => connectWalletHandler()}>Connect Wallet</Button>
        </div>
    )
}

export default ConnectWallet