import React, {useState, useEffect} from 'react'
import { signOut } from 'next-auth/react';
import {
    HomeIcon,
    LibraryIcon,
    SearchIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
    ZoomOutIcon
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify';



function Sidebar() {

    const spotifyApi = useSpotify();
    const {data: session} = useSession();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items);
            })
        }
    }, [session, spotifyApi])

    console.log(playlists);

    return (
        <div className='text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen'>
            <div className='space-y-4'>
                <button onClick={() => signOut()} className='flex items-center space-x-2 hover:text-white'>
                    <ZoomOutIcon className='h-5 w-5' />
                    <p>Logout</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HomeIcon className='h-5 w-5' />
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <SearchIcon className='h-5 w-5' />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <LibraryIcon className='h-5 w-5' />
                    <p>Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='h-5 w-5' />
                    <p>Create Playlist</p>
                </button>
  
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className='h-5 w-5' />
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className='h-5 w-5' />
                    <p>Your episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>


                {/* Playlist */}
                {
                    playlists.map((playlist) => (
                        <p key={playlist.id} className='cursor-pointer hover:text-white'> {playlist.name}</p>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar
