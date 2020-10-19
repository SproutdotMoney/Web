import { Line } from "rc-progress";
import {getEtherscanLink} from "../lib/utils";
import {formatEther, parseEther, formatUnits} from "@ethersproject/units";
import useSproutContract from "../hooks/useSproutContract";
import {useWeb3React} from "@web3-react/core";
import getReceipt from "../lib/getReceipt";
import {addToast} from "../hooks/useToast";
import { useEffect, useState } from 'react';

function Home() {

    //getting the contract of sprout
    const contract = useSproutContract()
    const { account, library } = useWeb3React();
    const [fields, setFields] = useState([{ to: null, amount: null, memo:null }]);

    function handleChangeTo(i, event) {
        const values = [...fields];
        values[i].to = event.target.value;
        setFields(values);
    }

    function handleChangeAmount(i, event) {
        const values = [...fields];
        values[i].amount = event.target.value;
        setFields(values);
    }

    function handleChangeMemo(i, event) {
        const values = [...fields];
        values[i].memo = event.target.value;
        setFields(values);
    }

    function handleAdd() {
        const values = [...fields];
        values.push({ to: null, amount:null, memo:null });
        setFields(values);
    }

    function handleRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    }

    // transferx function call
    const callTransferX = async () => {

        const addresses = [];
        const amounts = [];
        const memos = [];

        // get values dynamically from all input fields
        const values = [...fields];

        values.forEach(function(item, index, array) {
            addresses.push(item.to);
            amounts.push(item.amount);
            memos.push(item.memo);
        });

        try {
            const { hash } = await contract.transferx(addresses, amounts, memos);
            await getReceipt(hash, library);
        } catch (e) {
            addToast({ body: e.message, type: "error" });
        }
    };


    return (

        <div className="container">
            <div className="py-16 min-w-full flex flex-col justify-start items-center">
                <div className="py-4 w-full flex justify-center">
                    <div className="py-4 content-box w-full">
                        <p className="text-center text-lg font-bold text-white">
                            Welcome to TransferX. Here you can use the new TransferX to send multiple payments with 1 transaction or put memos.
                        </p>
                    </div>
                </div>

                {fields.map((field, idx) => {
                    return (
                        <div className="py-4 w-full" key={`${field}-${idx}` }>

                            <div className="md:flex flex-row w-full justify-center">
                                <div className="py-4 pr-2 pl-2 content-box w-full md:w-6/12">
                                    <p className="text-center text-lg font-bold text-white">
                                        To
                                    </p>
                                    <input className="text-center w-full justify-center" type="text" onChange={e => handleChangeTo(idx, e)}  />
                                </div>
                                <div className="py-4 pl-2 pr-2 content-box w-full md:w-6/12">
                                    <p className="text-center text-lg font-bold text-white">
                                        Amount
                                    </p>
                                    <input className="text-center w-full justify-center" type="number" onChange={e => handleChangeAmount(idx, e)}  />
                                </div>
                                <div className="py-4 pl-2 pr-2 content-box w-full md:w-6/12">
                                    <p className="text-center text-lg font-bold text-white">
                                        Memo
                                    </p>
                                    <input className="text-center w-full justify-center" type="text" onChange={e => handleChangeMemo(idx, e)}  />
                                </div>
                                <div className="py-4 pl-2 pr-2 text-center w-full md:w-1/12">
                                    <button style={{background: "red"}} className="btn" type="button" onClick={() => handleRemove(idx)}>
                                        <p className="capitalize hover:text-white">x</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div>
                    <button  style={{background: "#00bfff", text:"#202225"}} className="btn" type="button" onClick={() => handleAdd()}>
                        <p className="capitalize hover:text-white">Add</p>
                    </button>
                </div>
                <div className="pt-8 w-full text-center">
                    <button  style={{background: "#00ffad", text:"#202225"}} className="btn w-6/12" type="button" onClick={callTransferX}>
                        <p className="capitalize hover:text-white">TransferX Transaction</p>
                    </button>
                </div>
            </div>



            <style jsx>
                {`
          .content-box {
            border: 1px solid var(--offwhite);
            border-radius: var(--radius);
          }
        `}
            </style>
        </div>
    );
}
export default Home
