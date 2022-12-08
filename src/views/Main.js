import React, { useEffect, useState } from 'react'
import ConnectWallet from '../components/ConnectWallet'
import HacklistMinting from '../components/HacklistMinting'
import contractAbi from '../contractAbi.json'
import { contractAddress } from '../helper'
import { message } from 'antd'
import Web3 from 'web3'
import PublicMint from '../components/PublicMint'
import SoldOut from '../components/SoldOut'
import ContractPaused from '../components/ContractPaused'

const Main = () => {
    const web3 = new Web3(Web3.givenProvider);
    const { ethereum } = window
    const contract = new web3.eth.Contract(contractAbi, contractAddress)
    const [currentAccount, setCurrentAccount] = useState('');
    const [totalSupply, setTotalSupply] = useState(0)
    const [maxSupply, setMaxSupply] = useState(0)
    const [mintPhase, setMintPhase] = useState('');
    const [mintPhaseState, setMintPhaseState] = useState();
    // var clientReceiptContract = contract.at(contractAddress);

    async function getTotalSupply() {
        const total = await contract.methods.totalSupply().call();
        setTotalSupply(total)
    }

    async function getMaxSupply() {
        const total = await contract.methods.TotalCollectionSize_().call();
        setMaxSupply(total)
    }

    useEffect(() => {
        if (ethereum) {
            getTotalSupply();
            getMaxSupply();
        }
    }, [ethereum])

    var mintedTokensEvent = contract.events.mintedTokens({
        fromBlock: 'latest'
    }, function (error, event) {
        setTotalSupply(event.returnValues.total)
    })

    async function getPhaseMint() {
        const isWlMintActive = await contract.methods.presaleIsActive().call();
        const isPublicMintActive = await contract.methods.publicIsActive().call();
        if (isPublicMintActive == false && isWlMintActive == false) {
            setMintPhase('Paused')
        } else if (isWlMintActive == true && isPublicMintActive == false) {
            setMintPhase('Whitelist')
        } else if (isPublicMintActive == true && isWlMintActive == false) {
            setMintPhase('Public')
        }
    }

    useEffect(() => {
        getPhaseMint()
    }, [])

    var mintStateEvent = contract.events.mintState({
        fromBlock: 'latest'
    }, function (error, event) {
        getPhaseMint()
    })

    const connectWalletHandler = async () => {
        if (!ethereum) {
            alert('Please install metamask')
        }
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            setCurrentAccount(accounts[0])
            getPhaseMint()
            // message.success(`Wallet connected - ${accounts[0]}`);
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        if (ethereum) {
            ethereum.on("accountsChanged", () => {
                connectWalletHandler()
            });
        }
    }, [ethereum])

    return (
        <div className='main-section'>
            <div className='inner-section'>
                {
                    currentAccount == '' ?
                        <ConnectWallet connectWalletHandler={connectWalletHandler} />
                        :
                        totalSupply == maxSupply ?
                            <SoldOut currentAccount={currentAccount} totalSupply={totalSupply} maxSupply={maxSupply} />
                            :
                            mintPhase == 'Paused' ?
                                <ContractPaused contract={contract} currentAccount={currentAccount} ethereum={ethereum} web3={web3} totalSupply={totalSupply} maxSupply={maxSupply} getTotalSupply={getTotalSupply} />
                                :
                                mintPhase == 'Public' ?
                                    <PublicMint contract={contract} currentAccount={currentAccount} ethereum={ethereum} web3={web3} totalSupply={totalSupply} maxSupply={maxSupply} getTotalSupply={getTotalSupply} />
                                    :
                                    mintPhase == 'Whitelist' ?
                                        <HacklistMinting contract={contract} currentAccount={currentAccount} ethereum={ethereum} web3={web3} totalSupply={totalSupply} maxSupply={maxSupply} getTotalSupply={getTotalSupply} />
                                        : ''
                }
            </div>
        </div>
    )
}

export default Main