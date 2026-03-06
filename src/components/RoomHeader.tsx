import RoomTitle from './RoomTitle';
import ParticipantCounter from './ParticipantCounter';
import UserInfo from './UserInfo';
import HeaderActions from './HeaderActions';
import AnimatedEmoji from './AnimatedEmoji';
import { getEmojiForRoom } from '@/lib/decorativeEmojis';

interface RoomHeaderProps {
  roomId: string;
  userName?: string;
  onChangeName: () => void;
  participantCount?: number;
  maxParticipants?: number;
  onShareRoom?: () => void;
}

export default function RoomHeader({ 
  roomId, 
  userName, 
  onChangeName, 
  participantCount = 0, 
  maxParticipants = 4,
  onShareRoom
}: RoomHeaderProps) {
  const decorativeEmoji = getEmojiForRoom(roomId);

  return (
    <div className="flex justify-between items-start mb-8">
      {/* Left side - Room info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <AnimatedEmoji emoji={decorativeEmoji} animation="bounce" />
          <RoomTitle roomId={roomId} />
        </div>
        <div className="flex items-center gap-4">
          <ParticipantCounter 
            participantCount={participantCount} 
            maxParticipants={maxParticipants} 
          />
          {userName && (
            <UserInfo userName={userName} onChangeName={onChangeName} />
          )}
        </div>
      </div>
      
      {/* Right side - Actions */}
      <HeaderActions onShareRoom={onShareRoom} />
    </div>
  );
}