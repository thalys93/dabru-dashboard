import React from 'react'
import { Figure } from 'react-bootstrap'

interface UserAvatarProps {
    src?: string
}

function UserAvatar(props: UserAvatarProps) {
    const [src, setSrc] = React.useState<string>('')

    React.useEffect(() => {
        const checkUserPhoto = async () => {
            if (props.src !== null && props.src !== undefined && props.src !== '') {
                setSrc(props.src)
            } else {
                setSrc('/img/placeholder.jpg')
            }
        }      
        checkUserPhoto()          
    }, [props.src])    

  return (    
    <Figure className="flex flex-row gap-2 items-center select-none cursor-pointer">
        <Figure.Image
            width={40}
            height={40}
            alt="User Avatar"
            src={src}
            roundedCircle
        />
    </Figure>
  )
}

export default UserAvatar