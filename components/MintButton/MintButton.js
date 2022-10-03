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
  const { purchaseTrack } = useERC721DropContract()
  const [awaitingApproval, setAwaitingApproval] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = useCallback(async () => {
    setIsMinted(false)
    setAwaitingApproval(true)
    setErrors(undefined)
    try {
      const tx = await purchaseTrack(mintCounter, collection.trackNumber)
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
  }, [mintCounter, allowlistEntry, purchaseTrack])

  return (
    <MintButtonStyles
      isMinted={isMinted}
      collection={collection}
      onClick={handleMint}
      awaitingApproval={awaitingApproval}
      isMinting={isMinting}
      buttonText={`Mint "${collection.name}"`}
    />
  )
}

export default MintButton
