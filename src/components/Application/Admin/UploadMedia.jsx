'use client'

import { Button } from '@/components/ui/button';
import { CldUploadWidget } from 'next-cloudinary';
import { FiPlus } from "react-icons/fi";
import React from 'react'
import axios from 'axios';
import { showToast } from '@/lib/showToast';

export const UploadMedia = ({ isMultipal, queryClient }) => {

    const handleOnError = (error, options) => {
        showToast('error', error.statusText)
    }

    const handleOnQueuesEnd = async (results, options) => {
        const files = results.info.files
        const uploadedFiles = files?.filter(file => file.uploadInfo).map(file => ({
            asset_id: file.uploadInfo.asset_id,
            public_id: file.uploadInfo.public_id,
            secure_url: file.uploadInfo.secure_url,
            path: file.uploadInfo.path,
            thumbnail_url: file.uploadInfo.thumbnail_url,
        }))
        if (uploadedFiles?.length > 0) {
            try {
                const { data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles)
                if (!mediaUploadResponse.success) {
                    throw new Error(mediaUploadResponse.message)
                }
                queryClient.invalidateQueries(['media-data'])
                showToast('success', mediaUploadResponse.message)
            } catch (error) {
                showToast('error', error.message)
            }
        }
    }
    return (
        <CldUploadWidget
            signatureEndpoint="/api/cloudinary-signature"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPDATE_PRESET}
            onError={handleOnError}
            onQueuesEndAction={handleOnQueuesEnd}
            config={{
                cloud: {
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
                }
            }}
            options={{
                sources: ['local', 'url', 'unsplash', "google_drive", "camera"],
                multiple: isMultipal,
                // maxFiles: 10
            }}
        >
            {({ open }) => {
                return (
                    <Button onClick={() => open()}>
                        <FiPlus />
                        Upload an Image
                    </Button>
                );
            }}
        </CldUploadWidget>
    )
}
