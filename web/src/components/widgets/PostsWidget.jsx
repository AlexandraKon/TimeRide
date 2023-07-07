import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../redux/state";
import PostWidget from "./PostWidget";
import axios from "../../axios";


const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  const getPosts = async () => {
    const data = await axios.get(
      `/api/posts`,
    );
    dispatch(setPosts({ posts: data.data }));
  };

  const getUserPosts = async () => {
    const data = await axios.get(
      `/api/posts/${userId}/posts`,
    );
    dispatch(setPosts({ posts: data.data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []);

  return (
    <>
      {posts.result && posts.result.map(
        ({
          _id,
          title,
          text,
          tags,
          likes,
          comments,
          viewsCount,
          user,
          username,
          profilePicture,
          route,
          imageUrl,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            title={title}
            text={text}
            tags={tags}
            postUserId={user}
            username={username}
            routeUserId={route}
            profilePicture={profilePicture}
            comments={comments}
            viewsCount={viewsCount}
            imageUrl={imageUrl}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
