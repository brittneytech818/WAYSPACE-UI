import { Box, Well, Text, Paragraph, SpinnerOG } from '@zoralabs/zord'
import { MintStatus } from '@components/MintStatus'
import { MintDetails } from '@components/MintDetails'
import { ipfsImage } from '@lib/helpers'
import { maxWidth, border, heroImage, orangeText } from 'styles/styles.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { allChains } from 'wagmi'
import getDefaultProvider from '@lib/getDefaultProvider'
import { ethers } from 'ethers'
import abi from '@lib/WAYSPACE-abi.json'
import getDrop from '@lib/getDrop'
import { Spinner } from 'degen'

const axios = require('axios').default

const DropSection = ({ trackNumber, saleDetails }) => {
  const [drop, setDrop] = useState({})

  useEffect(() => {
    const load = async () => {
      // 1. load contract
      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
      const chain = allChains.find((chain) => chain.id.toString() === chainId)
      const provider = getDefaultProvider(chain.network, chainId)
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      const contract = new ethers.Contract(contractAddress.toString(), abi, provider)
      // 2. load metadata
      const songURI = await contract.songURI(trackNumber)
      const metadataURI = ipfsImage(songURI)
      const { data: metadata } = await axios.get(metadataURI)
      // 3. load drop
      const drop = getDrop(contract.address, metadata, saleDetails)
      drop.trackNumber = trackNumber
      setDrop(drop)
    }

    if (!drop.name) {
      load()
    }
  }, [trackNumber])

  if (!drop.editionMetadata) {
    return <h1 className={orangeText}>rendering wayspace...</h1>
  }

  return (
    <Box className={maxWidth} p="x4">
      <Text className={orangeText} variant="display-md" mb="x8" align="center">
        {drop.name}
      </Text>
      <Text className={orangeText}>{drop?.editionMetadata?.description}</Text>
      <Box mt="x8" mx="auto" style={{ maxWidth: 560 }}>
        <Well className={border} p="x6" style={{ borderBottom: 0 }}>
          <Image
            className={heroImage}
            src={ipfsImage(drop.editionMetadata.imageURI)}
            alt={drop.name}
            height={500}
            width={500}
          />
          {drop.editionMetadata?.mimeType?.includes?.('audio') && (
            <audio controls>
              <source
                src={ipfsImage(drop.editionMetadata.animationURI)}
                type={drop.editionMetadata.mimeType}
              />
              Your browser does not support the audio element.
            </audio>
          )}
        </Well>
        <Well className={border} p="x6">
          <Box>
            {drop != null ? (
              <>
                <MintStatus collection={drop} />
                <MintDetails collection={drop} showPresale={false} />
              </>
            ) : (
              <Paragraph align="center" mt="x8">
                <SpinnerOG />
              </Paragraph>
            )}
          </Box>
        </Well>
      </Box>
    </Box>
  )
}

export default DropSection
