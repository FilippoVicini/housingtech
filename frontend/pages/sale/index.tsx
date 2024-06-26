import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, WagmiContext, WagmiProvider, useReadContract , useAccount, useWriteContract} from 'wagmi';
import Link from 'next/link'
import { writeContract } from '@wagmi/core'
import { configAbi } from '../../abi/configAbi';
import { propertySaleAbi } from '../../abi/sale';
import { borrowerAbi } from '../../abi/borrower';
import { dropTransaction } from 'viem/actions';
import { arrayBuffer } from 'stream/consumers';
const { Web3 } = require('web3');


let Lender = new Array();
let Borrower = new Array();
let initialised = false;

const Home: NextPage = () => {
    const [borrower, setBorrower] = useState("");
    const [amount, setAmount] = useState("");
    const [interest, setInterest] = useState("");
    const [term, setTerm] = useState("");
    const [interval, setInterval] = useState("");
    const configAddress = "0xf1bB046fcbA08cBFad494FA25C7E523248d1d425";
    const address = useAccount().address;
    const [loans, setLoans] = useState(new Array());
    const [lenders, setLenders] = useState(new Array());
    const [borrowers,setBorrowers] = useState(new Array());



    const web3 = new Web3('https://rpc-evm-sidechain.xrpl.org');

    const contract = new web3.eth.Contract(configAbi,configAddress);

    const callConfigContract = async () => {const txReceipt =  await contract.methods.GetLoans().call(); return txReceipt}
    callConfigContract().then(function(results){setLoans(results);});
    const getOwner = async (lenderAddy: string) => {const c = new web3.eth.Contract(propertySaleAbi,lenderAddy); const txReceipt =  await c.methods.GetOwner().call(); return txReceipt}
    const getBorrower = async (lenderAddy: string) => {const c = new web3.eth.Contract(propertySaleAbi,lenderAddy); const txReceipt =  await c.methods.GetDebtContractAddress().call(); return txReceipt}
    const getBorrowerAddy = async (lenderAddy: string) => {const c = new web3.eth.Contract(borrowerAbi,lenderAddy); const txReceipt =  await c.methods.GetOwner().call(); return txReceipt}


    const AmountDue = new Array();
    const TimeTillDue = new Array();
    const TotalRemaining = new Array();
    const NftInfo = new Array();


    if (!initialised){
        console.log(initialised);
        for (var i = 0; i < loans.length; i++){
            const addy = loans[i];
            console.log(Lender);
            getOwner(addy).then(function(ownerAddy){
                if (ownerAddy as string == address as string){
                    Lender.push(address);
                    setLenders(Lender);
                    getBorrower(addy).then(function(borrowerContractAddress){
                        getBorrowerAddy(borrowerContractAddress).then(function(borrowerWallet){
                            Borrower.push(borrowerWallet);

                        })

                    })

                }})

        }
    }
    else{

    }
    initialised=true;


    const lenderBorrowerMap = new Map();
    for (var i = 0; i < Lender.length; i++){
        lenderBorrowerMap.set(Lender[i],Borrower[i]);
    }


    console.log(lenderBorrowerMap);


    const { data: hash, writeContract } = useWriteContract() ;


    const names = ["hello","there"];


    const [nameMap,setMap]= useState(new Map());

    const addItemToMap = (key: string, value: number) => {
        setMap((prevMap) => new Map(prevMap.set(key, value)));
    };

    const handleCreateLoanSubmit = async () => {
        writeContract({
            abi: configAbi,
            address: configAddress,
            functionName: "CreateLoan",
            args: [BigInt(amount),BigInt(term),BigInt(interval),+interest,address as "0x${string}",borrower as "0x${string}"],
        })

    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>XRPLendNet</title>
                <meta
                    content="Generated by @rainbow-me/create-rainbowkit"
                    name="description"
                />
                <link href="/favicon.ico" rel="icon"/>
            </Head>

            <main className="flex-grow">
                <div className="py-10 bg-blue-300 pl-auto pr-10">
                    <div className="flex justify-start">
                        <Link
                            className=" ml-10 items-center justify-centerflex rounded-full border-black bg-blue-500 px-5 py-1.5 duration-300 ease-in-out placeholder-blue-200 text-lg text-white "
                            href="/">Home</Link>
                        <Link
                            className=" ml-10 items-center justify-centerflex rounded-full border-black bg-blue-500 px-5 py-1.5 duration-300 ease-in-out placeholder-blue-200 text-lg text-white "
                            href="/borrower">Find</Link><div className="ml-12">
                        <ConnectButton/>
                    </div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="border border-blue-700 border-2 p-4 text-center italic rounded-lg mt-10 px-20">
                        <p className="text-blue-900 text-3xl mb-10 font-bold">Create a loan</p>
                        <div className="flex flex-col gap-5">
                            <div className="flex">
                                <input
                                    value={borrower}
                                    onChange={(e) => setBorrower(e.target.value)}
                                    type="text"
                                    placeholder="Enter borrower address"
                                    className="flex rounded-full border-black bg-blue-500 px-10 py-2.5 duration-300 ease-in-out placeholder-blue-200 text-xl text-white "
                                />
                            </div>
                            <div className="flex">
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    placeholder="Enter loan value in XRP"
                                    className="flex rounded-full border-black bg-blue-500 px-10 py-2.5 duration-300 ease-in-out placeholder-blue-200 text-xl text-white"
                                />
                            </div>
                            <div className="flex">
                                <input
                                    value={interest}
                                    onChange={(e) => setInterest(e.target.value)}
                                    type="number"
                                    placeholder="Enter percent interest"
                                    className="flex rounded-full border-black bg-blue-500 px-10 py-2.5 duration-300 ease-in-out placeholder-blue-200 text-xl text-white"
                                />
                            </div>
                            <div className="flex">
                                <input
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    type="number"
                                    placeholder="Enter term in days"
                                    className="flex rounded-full border-black bg-blue-500 px-10 py-2.5 duration-300 ease-in-out placeholder-blue-200 text-xl text-white"
                                />
                            </div>
                            <div className="flex">
                                <input
                                    value={interval}
                                    onChange={(e) => setInterval(e.target.value)}
                                    type="number"
                                    placeholder="Enter interval in days"
                                    className="flex rounded-full border-black bg-blue-500 px-10 py-2.5 duration-300 ease-in-out placeholder-blue-200 text-xl text-white"
                                />
                            </div>
                            <div className="flex">
                                <button
                                    onClick={handleCreateLoanSubmit}
                                    aria-label="button"
                                    className="flex rounded-full border-black bg-blue-500 px-10 py-2.5 duration-300 ease-in-out text-white text-xl"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                { (<div>
                    <h1 className="text-center text-blue-900 text-5xl mb-10 font-bold mt-10">Active loans</h1>
                    <ul className="flex flex-wrap">
                        {(Lender).map((name) => (
                            <li key={name} className="w-1/2 p-4">
                                <div className="border-blue-700 border-2 p-4 rounded-lg">
                                    <h1 className="text-blue-900 text-2xl mb-5 font-bold text-center">{name}</h1>
                                    <p className="text-blue-900 text-lg">Amount due:</p>
                                    <p className="text-blue-900 text-lg">Time till due:</p>
                                    <p className="text-blue-900 text-lg">Total remaining:</p>
                                    <p className="text-blue-900 text-lg">Nft info:</p>
                                    <p className="text-blue-900 text-lg mb-2">Borrower: {lenderBorrowerMap.get(name)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                </div>)}


            </main>
            <footer>
                <div className="py-5 bg-blue-300 mt-10">
                    <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank"
                       className="text-blue-900 flex justify-center">
                        Made with ❤️ by your friends at #60DaysofXRPL London 😎
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Home;