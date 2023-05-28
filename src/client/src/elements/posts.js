import { errorToast, successToast } from '../toasts'
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import Navbar from './nav-bar';

export default function Posts() {
	const userData = JSON.parse(localStorage.getItem('userData'))
	const [posts, setPosts] = useState([])
    const [page, setPage] = useState(0)

	useEffect(async () => {
		axios.get(`/api/v1/posts`)
        .then(res => setPosts(res.data))
		.catch(err => errorToast(err?.response?.data?.error || err.message));
    }, [])

	function getPosts(p) {
		if (page < 0) {
			return
		}

		if (posts.length < 10 && page <= p) {
			return errorToast('No more posts left.')
		}

		axios.get(`/api/v1/posts?page=${p}`)
		.then(res => {
			setPosts(res.data)
			setPage(p)
		})
		.catch(err => errorToast('Could not get posts.'))
	}

	function deletePost(id) {
		axios.delete(`/api/v1/posts/${id}`)
		.then(res => {
			successToast('Deleted post')
			setPosts(posts.filter(post => post._id !== id))
		})
		.catch(err => errorToast(err?.response?.data?.error || err.message))
	}

	function formatTimestamp(timestamp) {
		const date = new Date(timestamp)

		return date.toLocaleDateString("en-US", {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	return <>
		<Navbar/>

		<div style={{ 'font-size': 'medium' }}>
			<button class='generic-button' onClick={() => getPosts(page - 1)}>{`<`}</button>
			{page + 1}
			<button class='generic-button' onClick={() => getPosts(page + 1)}>{`>`}</button>
		</div>

		{posts?.map(post => {
			return <div class='ticket-section' title='ticket' style={{ width: "50%" }}>
                <div style={{ fontSize: 'xx-large' }}>{post.title}</div>
                <div class='ticket-status'>{formatTimestamp(post.createdAt)}</div>
                <div style={{ fontSize: 'large' }}>{post.text}</div>
				{userData.role === 'owner' && <button class='generic-button' onClick={() => deletePost(post._id)}>{`>`}</button>}
            </div>
		})}
	</>
}