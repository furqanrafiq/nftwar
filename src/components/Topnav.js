import { ArrowDownOutlined, BarsOutlined, TwitterOutlined } from '@ant-design/icons'
import React from 'react'
import logo from '../assets/img/logo.jpg'
import twitterLogo from '../assets/img/twitterIcon.png'
import openseaLogo from '../assets/img/openseaIcon.png'
import etherscanLogo from '../assets/img/etherscanLogo.webp'
import { Link } from 'react-router-dom'

const Topnav = () => {
    return (
        <div className='' style={{ position: 'absolute', width: '100%', top: "0px", background: 'black' }}>
            <nav className="navbar navbar-expand-sm container">
                <div className="container-fluid">
                    <Link to='/'>
                        <img src={logo} height='40px' />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <BarsOutlined style={{ fontSize: '30px', color: 'white' }} />
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a href='https://twitter.com/thenftwar' target="_blank">
                                    <img src={twitterLogo} style={{ marginRight: '20px', height: '20px' }} />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href='https://opensea.io/collection/thenftwar' target="_blank">
                                    <img src={openseaLogo} height="24px" style={{ marginRight: '20px' }} />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href='https://etherscan.io/address/0x1EC6f9a4921B817897f6b99692F1f8994261ad17#writeContract' target="_blank">
                                    <img src={etherscanLogo} height="24px" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Topnav