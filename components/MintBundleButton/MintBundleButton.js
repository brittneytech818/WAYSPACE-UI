import { useSaleStatus } from '@hooks/useSaleStatus'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button, SpinnerOG } from '@zoralabs/zord'
import { useERC721DropContract } from 'providers/ERC721DropProvider'
import { useCallback, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { waitingApproval } from 'styles/styles.css'
import { cleanErrors } from 'lib/errors'

const MintBundleButton = ({ collection }) => {
  const presale = false
  const { switchNetwork } = useNetwork()
  const { data: account } = useAccount()
  const { chainId, correctNetwork, purchaseBundle, purchase } = useERC721DropContract()
  const { saleNotStarted } = useSaleStatus({
    collection,
    presale,
  })
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
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <Button
          icon={isMinted ? 'Check' : undefined}
          iconSize="sm"
          size="lg"
          variant={
            account == null
              ? undefined
              : !correctNetwork
              ? 'destructive'
              : saleNotStarted
              ? 'secondary'
              : undefined
          }
          onClick={
            !account
              ? openConnectModal
              : !correctNetwork
              ? () => switchNetwork?.(chainId)
              : handleMint
          }
          style={isMinted ? { backgroundColor: '#1CB687' } : {}}
          className={awaitingApproval ? waitingApproval : ''}
          disabled={
            isMinting || awaitingApproval || (account && correctNetwork && saleNotStarted)
          }
        >
          {isMinting ? (
            <SpinnerOG />
          ) : !account ? (
            'Connect wallet'
          ) : !correctNetwork ? (
            'Wrong network'
          ) : awaitingApproval ? (
            'Confirm in wallet'
          ) : isMinted ? (
            'Minted'
          ) : saleNotStarted ? (
            'Not started'
          ) : (
            'Mint Bundle'
          )}
        </Button>
      )}
    </ConnectButton.Custom>
  )
}

export default MintBundleButton
