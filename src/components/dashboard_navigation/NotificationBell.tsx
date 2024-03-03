import { Bell } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap'

interface notificationProps {
    quantity: number
}

function NotificationBell(props: notificationProps) {
    const [shesHaveNotification, setShesHaveNotification] = useState(false)

    useEffect(() => {
        const checkIsHaveNotification = () => {
            if (props.quantity > 0) {
                setShesHaveNotification(true)
            } else {
                setShesHaveNotification(false)
            }
        }

        checkIsHaveNotification()
    })
    return (
        <div className='flex flex-row gap-2 items-center select-none cursor-pointer'>
            {shesHaveNotification ? (
                <>
                    <Bell className="text-2xl text-stone-400 transition-all hover:text-stone-700" weight='fill'/>
                    <Badge bg="danger" className='absolute top-1 ml-3 rounded-full text-xs scale-[0.7]'>{props.quantity}</Badge>
                </>
            ) : (
                <>
                    <Bell className="text-2xl text-stone-400 transition-all hover:text-stone-700" weight='light'/>
                    {/* <Badge bg="danger" className='absolute top-1 ml-3 rounded-full text-xs scale-75'>{props.quantity}</Badge> */}
                </>
            )}

        </div>
    )
}

export default NotificationBell