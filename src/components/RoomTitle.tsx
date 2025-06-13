interface RoomTitleProps {
  roomId: string;
}

export default function RoomTitle({ roomId }: RoomTitleProps) {
  return (
    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
      Room {roomId}
    </h1>
  );
}