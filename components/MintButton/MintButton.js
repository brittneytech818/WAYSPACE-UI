import { useSaleStatus } from '@hooks/useSaleStatus'
import { useERC721DropContract } from 'providers/ERC721DropProvider'
import { useCallback, useState } from 'react'
import { cleanErrors } from 'lib/errors'
import MintButtonStyles from '@components/MintButtonStyles'

const MintButton = ({
  isMinted,
  collection,
  mintCounter,
  allowlistEntry,
  setIsMinted,
  setErrors,
}) => {
  const presale = false
  const { purchaseTrack, purchase } = useERC721DropContract()
  const { saleNotStarted } = useSaleStatus({
    collection,
    presale,
  })
  const [awaitingApproval, setAwaitingApproval] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = useCallback(async () => {
    setIsMinted(false)
    setAwaitingApproval(true)
    setErrors(undefined)
    try {
      const tx = await purchaseTrack(mintCounter, collection.editionMetadata.trackNumber)
      setAwaitingApproval(false)
      setIsMinting(true)
      if (tx) {
        await tx.wait(2)
        setIsMinting(false)
        setIsMinted(true)
      } else {
        throw 'Error creating transaction! Please try again'
      }
    } catch (e) {
      setErrors(cleanErrors(e))
      setAwaitingApproval(false)
      setIsMinting(false)
    }
  }, [mintCounter, allowlistEntry, purchase, purchaseTrack])

  return (
    <MintButtonStyles
      isMinted={isMinted}
      collection={collection}
      onClick={handleMint}
      awaitingApproval={awaitingApproval}
      isMinting={isMinting}
      saleNotStarted={saleNotStarted}
      buttonText={`Mint "${collection.name}"`}
    />
  )
}

export default MintButton
