import {
  Stack,
  Flex,
} from '@zoralabs/zord'
import { ConnectWallet } from '@components/ConnectWallet'
import { NextPage } from 'next'
import { SubgraphERC721Drop } from 'models/subgraph'
import DropSection from '@components/DropSection'
import Head from '@components/Head'
import MintBundleButton from '@components/MintBundleButton'
import { ipfsImage } from '@lib/helpers'
import { header } from 'styles/styles.css'
import { useEffect, useState } from 'react'
import { Contract } from 'ethers'
import getDrop from '@lib/getDrop'
import { allChains } from 'wagmi'
import getDefaultProvider from '@lib/getDefaultProvider'
import { ethers, utils } from 'ethers'
import abi from '@lib/WAYSPACE-abi.json'
import { Spinner } from 'degen'

const axios = require('axios').default;

const HomePage: NextPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [drops, setDrops] = useState([]);
  const [dropCount, setDropCount] = useState(0);
  const [saleDetails, setSaleDetails] = useState({});
  
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  // Create Ethers Contract
  const chain = allChains.find(
    (chain) => chain.id.toString() === chainId
  )
  const provider = getDefaultProvider(chain.network, chainId);

  const handleResize = () => {
    setIsMobile(window?.innerWidth < 720)
  }
  

  useEffect(() => {

    const getDrops = async () => {
      const contract = new ethers.Contract(contractAddress.toString(), abi, provider);
      const dropArray = [];
    
      const numberOfDrops = await contract.dropsCreated();
      setDropCount(numberOfDrops);
      console.log("DROP COUNT", dropCount)
      const saleDetails = await contract.saleDetails();
      setSaleDetails(saleDetails)
      
      for (let i = 1; i <= numberOfDrops; i++) {
        dropArray.push(i);
      }
      const reversed = dropArray.reverse();
      console.log("dropArray", reversed)
      setDrops(reversed)
    }

    if(drops.length <= 0) {
      getDrops()
    }
  },[contractAddress, provider])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  },[])


  console.log("DROPS", drops)
  return (
    <>
      <Head ogImage="https://bafybeibp5izlizpzogq72kmeh5twvzdkffxvivcttllgknoccyfvfj7e74.ipfs.nftstorage.link/WELCOME-BACK.jpg" />
      <Flex justify="flex-end" p="x4" className={header}>
        <ConnectWallet />
      </Flex>
      <Stack>
      {drops.length > 0 && <MintBundleButton collection={getDrop(contractAddress, {}, saleDetails)} />}
      <Stack wrap direction={ isMobile ? "column" :"row"} mt="x3" gap="x3">
        {
          drops.length > 0  && drops.map((dropId) => 
            (<DropSection key={dropId} trackNumber={dropId} saleDetails={saleDetails} />)
          ) 
        }
      </Stack>
      </Stack>
    </>
  )
}

export default HomePage
