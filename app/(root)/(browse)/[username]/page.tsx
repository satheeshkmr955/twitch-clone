interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = (props: UserPageProps) => {
  const { params } = props;
  const { username } = params;

  return <div>User: {username}</div>;
};

export default UserPage;
