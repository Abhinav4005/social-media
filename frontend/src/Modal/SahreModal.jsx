import React from 'react'
import Button from '../components/UI/Button';
import { SmilePlus, UserRoundSearch } from 'lucide-react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";

const SahreModal = () => {
    const { user } = useSelector((state) => state.auth);
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col gap-5 text-black'
                >
                    <div className='flex items-center'>
                        <img
                            src=""
                            alt="user-image"
                            className='flex-shrink-0 w-10 h-10 rounded-full object-cover mr-3'
                        />
                        <div className='flex flex-col gap-2'>
                            <h4>{user.name}</h4>
                            <div className='flex items-center gap-2 text-sm text-gray-400'>
                                <div className='flex items-center gap-1 border border-gray-600 px-4 py-1 rounded-xl'>
                                    <span>Feed</span>
                                </div>
                                <div className='flex items-center gap-1 border border-gray-600 px-4 py-1 rounded-xl'>
                                    <span>Public</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <textarea
                            rows="4"
                            placeholder={`What's on your mind, ${user?.name || "User"}?`}
                            className="w-full resize-none focus:ring-0 outline-none border-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        {/* <div className='flex gap-2'>
                            <Button className='bg-white text-black hover:bg-white'><SmilePlus /></Button>
                            <Button><UserRoundSearch /></Button>
                        </div> */}
                        <div className='flex gap-2'>
                            <Button color="white">
                                <SmilePlus />
                            </Button>
                            <Button color="gray">
                                <UserRoundSearch />
                            </Button>
                        </div>

                        <div>
                            <Button>Share Now</Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default SahreModal;