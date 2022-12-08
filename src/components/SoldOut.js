import { Button, Input } from 'antd'
import React from 'react'

const SoldOut = ({ totalSupply, maxSupply }) => {
    return (
        <div>
            <div className='mb-3'>
                <p className='color-blue'>Sold Out</p>
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
                <div className='d-flex justify-content-between'>
                    <div>
                        <p className='color-gray'>0.015 ETH - Public</p>
                    </div>
                    <div>
                        <p className='color-gray'>Finished</p>
                    </div>
                </div>
            </div>
            {/* <div className='mb-3'>
                <Input max={5} defaultValue={1} suffix='5 max' />
            </div>
            <div>
                <Button>Sold Out</Button>
            </div> */}
        </div>
    )
}

export default SoldOut