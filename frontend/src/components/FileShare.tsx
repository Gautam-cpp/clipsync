'use client';

import useSocket from '@/hooks/useSocket';

import { useState, useRef } from 'react';

export default function FileShare({ room }: { room: string }) {
    const { wsRef, receivedFiles } = useSocket({ room });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !wsRef.current) return;
        uploadFile(file);
    };
    
    const uploadFile = (file: File) => {
        const socket = wsRef.current;
        if (!socket) return;
        
        setIsUploading(true);
        setUploadProgress(0);
        
        socket.send(JSON.stringify({
            type: "file-meta",
            name: file.name,
            size: file.size,
            mimeType: file.type,
            payload: {
                room: room
            }
        }));
        
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result instanceof ArrayBuffer) {
                socket.send(event.target.result);
                console.log(`⬆️ File sent: ${file.name}`);
                setIsUploading(false);
                setUploadProgress(100);
            }
        };
        
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(progress);
            }
        };
        
        reader.readAsArrayBuffer(file);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    };
    
    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        
        switch(extension) {
            case 'pdf': return '📄';
            case 'doc':
            case 'docx': return '📝';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif': return '🖼️';
            case 'mp3':
            case 'wav': return '🎵';
            case 'mp4':
            case 'mov': return '🎬';
            case 'zip':
            case 'rar': return '🗜️';
            default: return '📁';
        }
    };

    // if(session?.user.verified === false){
    //     return (
    //         <div className='fixed inset-0 flex flex-col items-center justify-center'>

    //             <div className=' text-3xl mx-auto p-6  '>Please verify your email first</div>
    //             <button>hello</button>
    //         </div>
    //     )
    // }
    
    return (
        <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Transfer Files</h1>
                <p className="text-gray-500 mt-2">Share files instantly in real-time</p>
            </div>
            
            
            <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragging 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    ref={fileInputRef}
                    id="file-upload"
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl mb-4">📤</div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                        {isDragging ? 'Drop your file here' : 'Drag & Drop your file here'}
                    </p>
                    <p className="text-gray-500 mb-4">or</p>
                    <button 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Browse Files
                    </button>
                </div>
            </div>
            
            {/* Progress Bar */}
            {isUploading && (
                <div className="mt-6">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-blue-700">Uploading...</span>
                        <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}
            
            {/* Received Files */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Received Files</h2>
                
                {receivedFiles ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <a 
                            href={receivedFiles.url} 
                            download={receivedFiles.name}
                            className="flex items-center gap-3 text-gray-800 hover:text-blue-600 transition-colors"
                        >
                            <span className="text-2xl">{getFileIcon(receivedFiles.name)}</span>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-medium truncate">{receivedFiles.name}</p>
                                <p className="text-sm text-gray-500">Click to download</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                        <div className="text-4xl mb-3">📥</div>
                        <p className="text-gray-500">No files received yet</p>
                        <p className="text-sm text-gray-400 mt-2">Files shared with you will appear here</p>
                    </div>
                )}
            </div>
            
            {/* Room Info */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Room ID: <span className="font-medium text-gray-700">{room}</span>
                </p>
            </div>
        </div>
    );
}
