import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  user: {
    name: string;
    avatar?: string;
  };
}

export function UserAvatar({ user }: UserAvatarProps) {
  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0].toUpperCase())
      .join("");
  }

  return (
    <Avatar className="h-8 w-8 rounded-lg">
      {user.avatar ? (
        <AvatarImage src={user.avatar} alt={user.name} />
      ) : (
        <AvatarFallback className="rounded-lg">
          {getInitials(user.name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
