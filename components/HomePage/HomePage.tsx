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

interface HomePageProps {
  collections: SubgraphERC721Drop[];
  chainId?: number;
}

const HomePage: NextPage<HomePageProps> = ({ collections, chainId }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window?.innerWidth < 720)
  }
  
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  },[])
  const ogImage = ipfsImage(collections[0].editionMetadata.imageURI)

  console.log("COLLECTIONS", collections)
  return (
    <>
      <Head ogImage={ogImage}/>
      <Flex justify="flex-end" p="x4" className={header}>
        <ConnectWallet />
      </Flex>
      <Stack>
      <MintBundleButton collection={collections[0]} />
      <Stack direction={ isMobile ? "column" :"row"} mt="x3" gap="x3">
        {
          collections.map((song) => 
            (<DropSection key={song.editionMetadata.trackNumber} collection={song} />)

          )
        }
      </Stack>
      </Stack>
    </>
  )
}

export default HomePage
