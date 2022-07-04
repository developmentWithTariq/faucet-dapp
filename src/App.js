import { useEffect, useState } from "react";
import { loadContract } from "./utils/loadContract"
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from "web3";
import "./App.css";


function App() {
  
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null

  })
  const [ account, setAccount ] = useState(null)
  const [ balance, setBalance ] = useState(null)

  useEffect(() => {

    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider)
      debugger

      if (provider ) {
        // provider.request({method : "eth_requestAccounts"})

        setWeb3Api({
          provider,
          web3: new Web3(provider),
          contract
        })
      } else {
        console.log("Please install metamask")
      }     
    
    }     

    loadProvider()
  }, [])

  useEffect(() => {
    const loadBalance = async () => {

      const  {contract, web3} = web3Api;
      const balance  = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))

    }
    web3Api.contract && loadBalance()
  },[web3Api])

  useEffect(() => {
    const getAccount = async () =>{
      const accounts = await web3Api.web3.eth.getAccounts()
      
      // console.log(accounts)/
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
  },[web3Api.web3])

  return (
    <>
      <div className="faucet-wrapper  is-justify-content-centre">
        <div className="faucet">
          <div  className = "is-flex is-algin-items-centre">
            <span>
              <strong className="mr-2">Account: </strong>

            </span>
              {
              account ?
              account: 
              <button
                className="btn mr-2 button is-small"
                onClick={ () => {
                  web3Api.provider.request( {method: "eth_requestAccounts"})
                  //  await window.ethereum.request({method: "eth_requestAccounts"})
                  // console.log(accounts)
                }}
              >connect Wallet</button>
              }
            </div>
          <div className="balance-view is-size-2  my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {/* <button
            className="btn mr-2"
            onClick={async () => {
              const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
              console.log(accounts)
            }}
          > */}
            {/* Enable Ethereum
          </button> */}
          <button className="button mr-2  is-primary is-small ">Donate</button>
          <button className="button is-link is-small">Withdraw</button>
        </div>
        </div>
        </>
        )
          }
export default App;


// Private key 32 byte number
// c0ab562fa567abc1597a9f9c840537342809a387f6d45f5e112d0d074c6875ce

// Public key(Uncompressed) 64 byte number
// 048bd5fbf4bc3d8421b8024229943170babd858b9338552ddccb2fa3da24f867ca071f658662bc263ef3272e15fd10a3abc9533991586f2e93136f548db9cb921f

// Public key(Compressed) 33 byte number
// 038bd5fbf4bc3d8421b8024229943170babd858b9338552ddccb2fa3da24f867ca