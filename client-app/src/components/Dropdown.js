import React, { useState } from "react";

export default function Dropdown({wallets, onChange}){
    return(
        <select className="custom-select" onChange={onChange}>
            <option>Select a Wallet</option>
            {wallets.map((wallet) =>(
                <option label={wallet.type} value={wallet.type}>
                    {wallet.type}
                </option>
            ))
            }
        </select>
    );
}