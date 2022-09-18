import { useERC721DropContract } from 'providers/ERC721DropProvider'
import { useCallback, useState } from 'react'
import MintButtonStyles from '@components/MintButtonStyles'
import { cleanErrors } from 'lib/errors'

const MintBundleButton = ({ collection }) => {
  const { purchaseBundle, purchase } = useERC721DropContract()
  const [awaitingApproval, setAwaitingApproval] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [isMinted, setIsMinted] = useState(false)

  const handleMint = useCallback(async () => {
    setIsMinted(false)
    setAwaitingApproval(true)
    try {
      const tx = await purchaseBundle(1)
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
      console.error(cleanErrors(e))
      setAwaitingApproval(false)
      setIsMinting(false)
    }
  }, [purchase, purchaseBundle])

  return (
    <MintButtonStyles
      isMinted={isMinted}
      collection={collection}
      onClick={handleMint}
      awaitingApproval={awaitingApproval}
      isMinting={isMinting}
      buttonText="Mint Bundle"
      collection={collection}
    />
  )
}

export default MintBundleButton
