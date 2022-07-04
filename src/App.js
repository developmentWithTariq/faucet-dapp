import { useEffect, useState } from "react";
import { loadContract } from "./utils/loadContract"
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from "web3";
import "./App.css";


function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false,

  })
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [reload, setReload] = useState(false)


  const canConnectToContract = account && web3Api.contract
  const reloadEffect = () => {
    setReload(!reload)
  }

  const setAccountListner = provider => {
    provider.on('accountsChanged', accounts => { setAccount(accounts[0]) })
    provider.on("chainChanged", _ => window.location.reload())
  }

  useEffect(() => {

    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      



      if (provider) {
        const contract = await loadContract("Faucet", provider)
        setAccountListner(provider)
        // provider.request({method : "eth_requestAccounts"})
        // debugger
        setWeb3Api({
          provider,
          web3: new Web3(provider),
          contract,
          isProviderLoaded: true,
        })
      } else {
        setWeb3Api(api => ({...api, isProviderLoaded: true}))
        console.log("Please install metamask")
      }

    }

    loadProvider()
  }, [])

  useEffect(() => {
    const loadBalance = async () => {

      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))

    }
    web3Api.contract && loadBalance()
  }, [web3Api, reload])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()

      // console.log(accounts)/
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()

  }, [web3Api.web3])


  const addFunds = async () => {

    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", 'ether')
    })
    reloadEffect()
    // window.location.reload()
  }
  const withDraw = async () => {
    const { contract, web3 } = web3Api
    const WithdrawAmount = web3.utils.toWei("0.1", 'ether')
    await contract.withdraw(WithdrawAmount, {
      from: account
    })
    reloadEffect()
  }






  return (
    <>
      <div className="faucet-wrapper  is-justify-content-centre">
        <div className="faucet">
          <div className="is-flex is-algin-items-centre">
             { web3Api.isProviderLoaded ?
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
                { account ?
                  <div>{account}</div> :
                  !web3Api.provider ?
                  <>
                    <div className="notification is-warning is-size-6 is-rounded">
                      Wallet is not detected!{` `}
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href="https://docs.metamask.io">
                        Install Metamask
                      </a>
                    </div>
                  </> :
                  <button
                    className="button is-small"
                    onClick={() =>
                      web3Api.provider.request({method: "eth_requestAccounts"}
                    )}
                  >
                    Connect Wallet
                  </button>
                }
            </div> :
            <span>Looking for Web3...</span>
          }
          </div>
          <div className="balance-view is-size-2  my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          { !canConnectToContract &&
            <i className="is-block">
              Connect to Ganache
            </i>
          }
          <button className="button mr-2  is-primary is-small "
            disabled={!canConnectToContract}
            onClick={() => {
              addFunds()

            }}>Donate</button>
          <button className="button is-link is-small"
            disabled={!canConnectToContract}
            onClick={() => {
              withDraw()
            }} >Withdraw</button>
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









// import { useCallback, useEffect, useState } from "react";
// import "./App.css";
// import Web3 from "web3";
// import detectEthereumProvider from '@metamask/detect-provider'
// import { loadContract } from "./utils/loadContract";


// function App() {
//   const [web3Api, setWeb3Api] = useState({
//     provider: null,
//     isProviderLoaded: false,
//     web3: null,
//     contract: null
//   })

//   const [balance, setBallance] = useState(null)
//   const [account, setAccount] = useState(null)
//   const [shouldReload, reload] = useState(false)

//   const canConnectToContract = account && web3Api.contract
//   const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

//   const setAccountListener = provider => {
//     provider.on("accountsChanged", _ => window.location.reload())
//     provider.on("chainChanged", _ => window.location.reload())
//   }

//   useEffect(() => {
//     const loadProvider = async () => {
//       const provider = await detectEthereumProvider()

//       if (provider) {
//         const contract = await loadContract("Faucet", provider)
//         setAccountListener(provider)
//         setWeb3Api({
//           web3: new Web3(provider),
//           provider,
//           contract,
//           isProviderLoaded: true
//         })
//       } else {
//         setWeb3Api(api => ({...api, isProviderLoaded: true}))
//         console.error("Please, install Metamask.")
//       }
//     }

//     loadProvider()
//   }, [])

//   useEffect(() => {
//     const loadBalance = async () => {
//       const { contract, web3 } = web3Api
//       const balance = await web3.eth.getBalance(contract.address)
//       setBallance(web3.utils.fromWei(balance, "ether"))
//     }

//     web3Api.contract && loadBalance()
//   }, [web3Api, shouldReload])

//   useEffect(() => {
//     const getAccount = async () => {
//       const accounts = await web3Api.web3.eth.getAccounts()
//       setAccount(accounts[0])
//     }

//     web3Api.web3 && getAccount()
//   }, [web3Api.web3])

//   const addFunds = useCallback(async () => {
//     const { contract, web3 } = web3Api
//     await contract.addFunds({
//       from: account,
//       value: web3.utils.toWei("1", "ether")
//     })

//     reloadEffect()
//   }, [web3Api, account, reloadEffect])

//   const withdraw = async () => {
//     const { contract, web3 } = web3Api
//     const withdrawAmount = web3.utils.toWei("0.1", "ether")
//     await contract.withdraw(withdrawAmount, {
//       from: account
//     })
//     reloadEffect()
//   }

//   return (
//     <>
//       <div className="faucet-wrapper">
//         <div className="faucet">
//           { web3Api.isProviderLoaded ?
//             <div className="is-flex is-align-items-center">
//               <span>
//                 <strong className="mr-2">Account: </strong>
//               </span>
//                 { account ?
//                   <div>{account}</div> :
//                   !web3Api.provider ?
//                   <>
//                     <div className="notification is-warning is-size-6 is-rounded">
//                       Wallet is not detected!{` `}
//                       <a
//                         rel="noreferrer"
//                         target="_blank"
//                         href="https://docs.metamask.io">
//                         Install Metamask
//                       </a>
//                     </div>
//                   </> :
//                   <button
//                     className="button is-small"
//                     onClick={() =>
//                       web3Api.provider.request({method: "eth_requestAccounts"}
//                     )}
//                   >
//                     Connect Wallet
//                   </button>
//                 }
//             </div> :
//             <span>Looking for Web3...</span>
//           }
//           <div className="balance-view is-size-2 my-4">
//             Current Balance: <strong>{balance}</strong> ETH
//           </div>
//           { !canConnectToContract &&
//             <i className="is-block">
//               Connect to Ganache
//             </i>
//           }
//           <button
//             disabled={!canConnectToContract}
//             onClick={addFunds}
//             className="button is-link mr-2">
//               Donate 1 eth
//             </button>
//           <button
//             disabled={!canConnectToContract}
//             onClick={withdraw}
//             className="button is-primary">Withdraw 0.1 eth</button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;


// // Private key 32 byte number
// // c0ab562fa567abc1597a9f9c840537342809a387f6d45f5e112d0d074c6875ce

// // Public key(Uncompressed) 64 byte number
// // 048bd5fbf4bc3d8421b8024229943170babd858b9338552ddccb2fa3da24f867ca071f658662bc263ef3272e15fd10a3abc9533991586f2e93136f548db9cb921f

// // Public key(Compressed) 33 byte number