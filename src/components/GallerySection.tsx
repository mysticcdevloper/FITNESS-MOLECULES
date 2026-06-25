/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GALLERY_IMGS, TRANSFORMATION_IMGS } from '../data/gymData';
import { 
  Eye, 
  X, 
  ZoomIn, 
  Play, 
  Upload, 
  Film, 
  FileVideo, 
  Globe, 
  Trash2, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2,
  Lock
} from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  saveVideo, 
  getAllVideos, 
  deleteVideo,
  savePhotograph,
  getAllPhotographs,
  deletePhotograph
} from '../lib/firebaseService';
import { storeLocalVideoBlob, deleteLocalVideoBlob, getLocalVideoBlob } from '../lib/videoStorage';
import { storeLocalImageBlob, deleteLocalImageBlob, getLocalImageBlob } from '../lib/imageStorage';
import { Video, Photograph, isAdminEmail } from '../types';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface DynamicVideoProps {
  url: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  isThumbnail?: boolean;
}

function DynamicVideo({ url, className, controls, autoPlay, muted, playsInline, isThumbnail }: DynamicVideoProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;
    let objectUrl = '';

    const loadVideo = async () => {
      if (url.startsWith('indexeddb://')) {
        const id = url.replace('indexeddb://', '');
        setLoading(true);
        try {
          const file = await getLocalVideoBlob(id);
          if (!active) return;
          if (file) {
            objectUrl = URL.createObjectURL(file);
            setResolvedUrl(objectUrl);
          } else {
            setResolvedUrl('');
          }
        } catch (err) {
          console.error("Failed to load local video blob:", err);
        } finally {
          if (active) setLoading(false);
        }
      } else {
        let finalUrl = url;
        if (isThumbnail && !url.includes('#t=')) {
          finalUrl += '#t=0.1';
        }
        setResolvedUrl(finalUrl);
      }
    };

    loadVideo();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, isThumbnail]);

  // Hook up video attributes and programmatic play fallback for browsers blocking unmuted autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedUrl) return;

    // Force reloading the video source
    video.load();

    // Browser seeking fallback instead of URL hashes if we are displaying a local indexeddb blob thumbnail
    if (isThumbnail && url.startsWith('indexeddb://')) {
      const handleLoadedMetadata = () => {
        video.currentTime = 0.15;
      };
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }

    if (autoPlay) {
      // First try unmuted playback
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Unmuted autoplay restricted, playing muted as fallback:", err);
          // If browser restricts unmuted noise on page activation, start muted to guarantee video movement
          video.muted = true;
          video.play().catch((mutedErr) => {
            console.error("Muted playback attempt also failed:", mutedErr);
          });
        });
      }
    }
  }, [resolvedUrl, autoPlay, isThumbnail, url]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-zinc-950 ${className}`}>
        <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!resolvedUrl) {
    return (
      <div className={`flex items-center justify-center bg-zinc-950 text-zinc-600 text-xs ${className}`}>
        Video unavailable
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={resolvedUrl}
      className={className}
      controls={controls}
      muted={muted}
      playsInline={playsInline ?? true}
      preload="auto"
    />
  );
}

interface DynamicImageProps {
  url: string;
  alt: string;
  className?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

function DynamicImage({ url, alt, className, referrerPolicy }: DynamicImageProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    let objectUrl = '';

    const loadImage = async () => {
      if (url.startsWith('indexeddb-img://')) {
        const id = url.replace('indexeddb-img://', '');
        setLoading(true);
        try {
          const file = await getLocalImageBlob(id);
          if (!active) return;
          if (file) {
            objectUrl = URL.createObjectURL(file);
            setResolvedUrl(objectUrl);
          } else {
            setResolvedUrl('');
          }
        } catch (err) {
          console.error("Failed to load local image blob:", err);
        } finally {
          if (active) setLoading(false);
        }
      } else {
        setResolvedUrl(url);
      }
    };

    loadImage();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 ${className}`}>
        <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!resolvedUrl) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 text-zinc-650 text-xs ${className}`}>
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={resolvedUrl}
      alt={alt}
      className={className}
      referrerPolicy={referrerPolicy}
    />
  );
}

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState<'photos' | 'transformations' | 'videos'>('transformations');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string>('');

  // Video State
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [videoModalSize, setVideoModalSize] = useState<'compact' | 'standard' | 'cinema' | 'immersive'>('standard');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'auto' | '16-9' | '21-9' | '4-3'>('auto');
  
  // Video Form Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadType, setUploadType] = useState<'link' | 'file'>('link');
  const [linkUrl, setLinkUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo State
  const [customPhotos, setCustomPhotos] = useState<Photograph[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photograph | null>(null);

  // Photo Form Modal State
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUploadType, setPhotoUploadType] = useState<'link' | 'file'>('link');
  const [photoLinkUrl, setPhotoLinkUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState(false);

  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Load all videos from database / fallback
  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const list = await getAllVideos();
      setVideos(list);
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Load custom photographs
  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const list = await getAllPhotographs();
      const filtered = list.filter(p => p.id !== 'photo_wpwchyl7o');
      setCustomPhotos(filtered);
    } catch (err) {
      console.error("Failed to load photographs:", err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    
    const loadAndCleanup = async () => {
      await fetchPhotos();
      try {
        const idsToPurge = [
          'photo_wpwchyl7o',
          'photo_qtqoh95ai',
          'photo_te34zbnpy',
          'photo_cukdwoowi',
          'photo_lmpr2bvmq'
        ];
        for (const id of idsToPurge) {
          await deletePhotograph(id);
        }
        await fetchPhotos();
      } catch (err) {
        console.error("Auto-purge photos error:", err);
      }
    };
    
    loadAndCleanup();
  }, []);

  const openLightbox = (url: string, caption: string) => {
    setSelectedImage(url);
    setSelectedCaption(caption);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedCaption('');
  };

  // Video Helpers
  const isEmbedUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.includes('embed');
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1]?.split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
    }
    if (url.includes('youtube.com/shorts/')) {
      return url.split('shorts/')[1]?.split('?')[0]?.split('&')[0];
    }
    if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1]?.split('?')[0]?.split('&')[0];
    }
    return null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const id = getYouTubeId(url);
    if (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    return null;
  };

  const getEmbedUrl = (url: string) => {
    const ytId = getYouTubeId(url);
    if (ytId) {
      // Use youtube-nocookie to bypass strict iframe cookie policies on production builds
      return `https://www.youtube-nocookie.com/embed/${ytId}`;
    }

    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      const parts = url.split('vimeo.com/');
      const id = parts[parts.length - 1]?.split('?')[0]?.split('&')[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return url;
  };

  // Drag and Drop Handling
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, or Mov).');
      return;
    }
    // limit local file size to 250MB for smooth browser performance
    if (file.size > 250 * 1024 * 1024) {
      setError('Local video exceeds 250MB. Please upload a smaller video clip or paste a YouTube / Web video link.');
      return;
    }
    setVideoFile(file);
    setError(null);
  };

  // User authentication context
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [deletedStaticUrls, setDeletedStaticUrls] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    // Load deleted static template photographs
    try {
      const saved = JSON.parse(localStorage.getItem('molecule_deleted_static_photos') || '[]');
      setDeletedStaticUrls(saved);
    } catch (err) {
      console.error("Failed to load deleted static photos", err);
    }

    return () => unsubscribe();
  }, []);

  const currentEmail = currentUser?.email || '';
  const isAdmin = currentUser ? isAdminEmail(currentUser?.email) : false;

  // Handle Video Addition
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isAdmin) {
      setError('Access denied. Only registered administrators can upload walkthrough videos.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a video title.');
      return;
    }

    if (uploadType === 'link' && !linkUrl.trim()) {
      setError('Please enter a video URL link.');
      return;
    }

    if (uploadType === 'file' && !videoFile) {
      setError('Please select or drop a local video file.');
      return;
    }

    setUploading(true);

    try {
      let finalUrl = linkUrl;
      
      if (uploadType === 'file' && videoFile) {
        const localId = "loc_blob_" + Math.random().toString(36).substring(2, 11);
        finalUrl = await storeLocalVideoBlob(localId, videoFile);
      }

      await saveVideo({
        title: title.trim(),
        description: description.trim(),
        url: finalUrl,
        uploaderName: auth.currentUser?.displayName || currentEmail.split('@')[0] || 'Member Athlete'
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setLinkUrl('');
      setVideoFile(null);
      setActiveTab('videos');
      
      // Reload video stream
      await fetchVideos();

      setTimeout(() => {
        setSuccess(false);
        setShowUploadModal(false);
      }, 1500);

    } catch (err: any) {
      setError(err?.message || 'Failed to sync video to database. Attempting fallback save.');
    } finally {
      setUploading(false);
    }
  };

  // Delete video reference
  const handleDeleteVideo = async (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    if (!isAdmin) {
      console.warn("Access denied. Only registered administrators can delete walkthrough videos.");
      return;
    }
    setVideoToDelete(video);
  };

  // --- PHOTOGRAPH DRAG AND DROP HANDLERS ---
  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPhotoDragging(true);
  };

  const handlePhotoDragLeave = () => {
    setIsPhotoDragging(false);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPhotoDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoFileSelection(e.target.files[0]);
    }
  };

  const handlePhotoFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, WebP, SVG, GIF).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError('Local image exceeds 15MB. Please upload a smaller photograph, or paste an external image link.');
      return;
    }
    setPhotoFile(file);
    setPhotoError(null);
  };

  // Handle Photo Addition Submission
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError(null);
    setPhotoSuccess(false);

    if (!isAdmin) {
      setPhotoError('Access denied. Only registered administrators can upload photographs.');
      return;
    }

    if (!photoCaption.trim()) {
      setPhotoError('Please enter a photograph caption.');
      return;
    }

    if (photoUploadType === 'link' && !photoLinkUrl.trim()) {
      setPhotoError('Please enter an image URL link.');
      return;
    }

    if (photoUploadType === 'file' && !photoFile) {
      setPhotoError('Please select or drop a local image file.');
      return;
    }

    setPhotoUploading(true);

    try {
      let finalUrl = photoLinkUrl;
      
      if (photoUploadType === 'file' && photoFile) {
        const localId = "img_blob_" + Math.random().toString(36).substring(2, 11);
        finalUrl = await storeLocalImageBlob(localId, photoFile);
      }

      await savePhotograph({
        caption: photoCaption.trim(),
        url: finalUrl,
        uploaderName: auth.currentUser?.displayName || currentEmail.split('@')[0] || 'Member Athlete'
      });

      setPhotoSuccess(true);
      setPhotoCaption('');
      setPhotoLinkUrl('');
      setPhotoFile(null);
      setActiveTab('photos');
      
      // Reload photographs stream
      await fetchPhotos();

      setTimeout(() => {
        setPhotoSuccess(false);
        setShowPhotoUploadModal(false);
      }, 1500);

    } catch (err: any) {
      setPhotoError(err?.message || 'Failed to sync photograph to database.');
    } finally {
      setPhotoUploading(false);
    }
  };

  // Delete photograph reference
  const handleDeletePhoto = async (e: React.MouseEvent, photo: Photograph) => {
    e.stopPropagation();
    if (!isAdmin) {
      console.warn("Access denied. Only registered administrators can delete photographs.");
      return;
    }
    setPhotoToDelete(photo);
  };

  const visibleStaticPhotos = GALLERY_IMGS.filter(img => !deletedStaticUrls.includes(img.url));

  return (
    <section className="py-20 bg-zinc-950 text-white min-h-[500px]" id="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-widest text-red-500 bg-red-500/10 px-3.5 py-1.5 rounded-full uppercase">
            Facility Overview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mt-4 tracking-tight leading-none">
            THE FITNESS <span className="text-red-500">ARENA</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed font-sans">
            A high-contrast visual inspection of our 10,000+ Sq. Ft. elite facility. Designed for ultimate biomechanics, rich acoustic stimulation, and premium heavy loading.
          </p>
        </div>

        {/* Tab Switcher & Action Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800/80 pb-6 mb-10 gap-4">
          <div className="flex flex-wrap bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium tracking-wide uppercase transition-all duration-250 cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-red-500 text-white font-bold shadow-lg shadow-red-500/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Facility Photos ({visibleStaticPhotos.length + customPhotos.length})
            </button>
            <button
              onClick={() => setActiveTab('transformations')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium tracking-wide uppercase transition-all duration-250 cursor-pointer ${
                activeTab === 'transformations'
                  ? 'bg-red-500 text-white font-bold shadow-lg shadow-red-500/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Transformations ({TRANSFORMATION_IMGS.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium tracking-wide uppercase transition-all duration-250 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-red-500 text-white font-bold shadow-lg shadow-red-500/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Walkthrough Videos ({videos.length})
            </button>
          </div>

          {activeTab === 'photos' && isAdmin && (
            <div className="flex items-center space-x-3 shrink-0">
              {deletedStaticUrls.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('molecule_deleted_static_photos');
                    setDeletedStaticUrls([]);
                  }}
                  className="px-4 py-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-mono font-bold border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center space-x-1.5 transition-all shadow-md active:scale-98"
                  title="Restore default gallery photographs"
                >
                  <span>RESTORE ALL TEMPLATES ({deletedStaticUrls.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowPhotoUploadModal(true);
                }}
                className="px-5 py-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-mono font-bold border border-zinc-800 hover:border-red-500/40 cursor-pointer flex items-center space-x-2 transition-all shadow-md group shrink-0 active:scale-98"
              >
                <Camera className="h-4 w-4 text-red-500" />
                <span>UPLOAD PHOTOGRAPH</span>
              </button>
            </div>
          )}

          {activeTab === 'videos' && isAdmin && (
            <button
              onClick={() => {
                setShowUploadModal(true);
              }}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-mono font-bold border border-zinc-800 hover:border-red-500/40 cursor-pointer flex items-center space-x-2 transition-all shadow-md group shrink-0 active:scale-98"
            >
              <Upload className="h-4 w-4 text-red-500" />
              <span>UPLOAD WALKTHROUGH</span>
            </button>
          )}
        </div>

        {/* --- PHOTOS GRID TAB --- */}
        {activeTab === 'photos' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Custom Admin-Uploaded Photos */}
            {customPhotos.map((img) => (
              <div
                key={img.id}
                onClick={() => openLightbox(img.url, img.caption)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-900/60 aspect-4/3 shadow-md"
                id={`gallery-custom-${img.id}`}
              >
                <DynamicImage
                  url={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="bg-red-500 text-white p-2.5 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeletePhoto(e, img)}
                        className="bg-zinc-900/90 hover:bg-red-650 text-zinc-300 hover:text-white p-2.5 rounded-full scale-75 group-hover:scale-100 transition-all duration-300 border border-zinc-850 hover:border-red-500 shadow cursor-pointer"
                        title="Delete Photograph"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <h4 className="text-white font-medium text-sm font-display px-2 line-clamp-2">
                    {img.caption}
                  </h4>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 mt-1 uppercase block">
                    By {img.uploaderName} • {img.createdAt}
                  </span>
                </div>

                {/* Caption Bottom bar (mobile visible) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/90 to-transparent p-4 sm:hidden">
                  <span className="text-xs text-white text-sans font-medium line-clamp-1">{img.caption}</span>
                </div>
              </div>
            ))}

            {/* Static Gallery Photos */}
            {visibleStaticPhotos.map((img, i) => (
              <div
                key={`static-${i}`}
                onClick={() => openLightbox(img.url, img.caption)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-900/60 aspect-4/3 shadow-md"
                id={`gallery-item-${i}`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="bg-red-500 text-white p-2.5 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoToDelete({
                            id: `static_${i}`,
                            caption: img.caption,
                            url: img.url,
                            createdAt: ''
                          });
                        }}
                        className="bg-zinc-900/90 hover:bg-red-650 text-zinc-300 hover:text-white p-2.5 rounded-full scale-75 group-hover:scale-100 transition-all duration-300 border border-zinc-850 hover:border-red-500 shadow cursor-pointer"
                        title="Delete Photograph"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <h4 className="text-white font-medium text-sm font-display px-2 line-clamp-2">
                    {img.caption}
                  </h4>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 mt-1 uppercase block">
                    ARENA CORE TEMPLATE
                  </span>
                </div>

                {/* Caption Bottom bar (mobile visible) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/90 to-transparent p-4 sm:hidden">
                  <span className="text-xs text-white text-sans font-medium line-clamp-1">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TRANSFORMATIONS GRID TAB --- */}
        {activeTab === 'transformations' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {TRANSFORMATION_IMGS.map((img, i) => (
              <div
                key={`transformation-${i}`}
                onClick={() => openLightbox(img.url, img.caption)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-900/60 aspect-4/3 shadow-md"
                id={`gallery-transformation-item-${i}`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="bg-red-500 text-white p-2.5 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  </div>
                  <h4 className="text-white font-medium text-base font-display px-4 tracking-wide font-bold uppercase transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                    {img.caption}
                  </h4>
                  <span className="text-[10px] font-mono tracking-widest text-red-500 mt-2 uppercase block font-bold border border-red-500/20 bg-red-500/10 px-2 py-0.5 rounded">
                    MEMBER GLOW-UP
                  </span>
                </div>

                {/* Caption Bottom bar (mobile visible) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/90 to-transparent p-4 sm:hidden">
                  <span className="text-xs text-white text-sans font-medium line-clamp-1">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VIDEOS GRID TAB --- */}
        {activeTab === 'videos' && (
          <>
            {loadingVideos ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
                <p className="text-zinc-500 font-mono text-xs mt-4">PAGING ENCRYPTED STREAM VIDEO ASSETS...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-850 rounded-3xl bg-zinc-900/10">
                <Film className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-display text-zinc-300 font-medium">No Walkthrough Videos Synced</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 font-sans font-normal">
                  Authentic training biomechanics updates are managed via private database uploads. Register an account and share your progress!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-750 p-4 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Video Thumbnail Placeholder/Visual layout */}
                      <div className="relative aspect-video rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-zinc-850 mb-4 group-hover:border-zinc-800">
                        {isEmbedUrl(vid.url) ? (
                          <div className="absolute inset-0">
                            {getYouTubeThumbnail(vid.url) ? (
                              <>
                                <img
                                  src={getYouTubeThumbnail(vid.url)!}
                                  alt={vid.title}
                                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-zinc-950/40" />
                              </>
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-md">
                                <Play className="h-6 w-6 ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/85 rounded font-mono text-[9px] tracking-wide text-zinc-400 border border-zinc-800">
                              {vid.url.includes('vimeo') ? 'VIMEO WALK' : 'YOUTUBE WALK'}
                            </span>
                          </div>
                        ) : (
                          <div className="absolute inset-0">
                            {/* Locally rendered video tag paused as generic thumbnail */}
                            <DynamicVideo url={vid.url} isThumbnail={true} className="w-full h-full object-cover opacity-75 pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="h-12 w-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Play className="h-6 w-6 ml-1" />
                              </div>
                            </div>
                            <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-red-500/25 border border-red-500/20 text-red-400 rounded font-mono text-[9px] tracking-wide uppercase">
                              {vid.url.startsWith('indexeddb://') ? 'LOCAL SANDBOX' : 'RAW STREAM'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Video Title and Caption */}
                      <div className="text-left">
                        <h4 className="text-white font-medium text-base font-display line-clamp-1 leading-tight group-hover:text-red-500 transition-colors">
                          {vid.title}
                        </h4>
                        <p className="text-zinc-400 text-xs mt-2 font-sans font-normal line-clamp-2 leading-relaxed">
                          {vid.description || "No supplemental biomechanics description logs provided."}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between border-t border-zinc-850 mt-4 pt-3 text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500">
                      <span>By: <strong className="text-zinc-400">{vid.uploaderName}</strong></span>
                      <div className="flex items-center space-x-2">
                        <span>{vid.createdAt}</span>
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDeleteVideo(e, vid)}
                            className="p-1 hover:text-red-500 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                            title="Delete walkthrough"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}        {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
        {videoToDelete && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setVideoToDelete(null)}
          >
            <div 
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white">Delete Video?</h3>
              <p className="text-xs text-zinc-450 mt-2 leading-relaxed">
                Are you sure you want to delete <strong className="text-zinc-200">"{videoToDelete.title}"</strong>?<br/>
                This will delete the file permanently.
              </p>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setVideoToDelete(null)}
                  className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-xl text-xs font-mono font-bold border border-zinc-850 transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={async () => {
                    const vidId = videoToDelete.id;
                    const videoUrl = videoToDelete.url;
                    setVideoToDelete(null);
                    try {
                      await deleteVideo(vidId);
                      if (videoUrl && videoUrl.startsWith('indexeddb://')) {
                        const localId = videoUrl.replace('indexeddb://', '');
                        await deleteLocalVideoBlob(localId);
                      }
                      await fetchVideos();
                    } catch (err) {
                      console.error("Delete failed:", err);
                    }
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-650 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  DELETE WALKTHROUGH
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- CUSTOM PHOTOGRAPH DELETE CONFIRMATION MODAL --- */}
        {photoToDelete && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setPhotoToDelete(null)}
          >
            <div 
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white">Delete Photograph?</h3>
              <p className="text-xs text-zinc-450 mt-2 leading-relaxed">
                Are you sure you want to delete this photograph?<br/>
                <span className="text-zinc-300 font-sans italic font-normal text-xs block mt-1">"{photoToDelete.caption}"</span><br/>
                This will delete the file permanently.
              </p>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setPhotoToDelete(null)}
                  className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-xl text-xs font-mono font-bold border border-zinc-850 transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={async () => {
                    const p = photoToDelete;
                    setPhotoToDelete(null);
                    try {
                      if (p.id.startsWith('static_')) {
                        const updated = [...deletedStaticUrls, p.url];
                        setDeletedStaticUrls(updated);
                        localStorage.setItem('molecule_deleted_static_photos', JSON.stringify(updated));
                      } else {
                        if (p.url && p.url.startsWith('indexeddb-img://')) {
                          const localId = p.url.replace('indexeddb-img://', '');
                          await deleteLocalImageBlob(localId);
                        }
                        await deletePhotograph(p.id);
                        await fetchPhotos();
                      }
                    } catch (err) {
                      console.error("Delete photo failed:", err);
                    }
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-650 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  DELETE PHOTO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- PHOTOGRAPH LIGHTBOX MODAL --- */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={closeLightbox}
          >
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <button
                onClick={closeLightbox}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-colors border border-zinc-800"
                aria-label="Close Lightbox"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div 
              className="max-w-4xl w-full flex flex-col relative max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt={selectedCaption}
                className="w-full h-auto max-h-[75vh] object-contain rounded-2xl mx-auto shadow-2xl border border-zinc-900"
                referrerPolicy="no-referrer"
              />
              {selectedCaption && (
                <div className="text-center mt-4">
                  <h4 className="text-red-500 font-display font-medium text-lg leading-tight">
                    {selectedCaption}
                  </h4>
                  <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider block mt-1">
                    Fitness Molecule • Premium Interior Layout
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIDEO IMMERSIVE LIGHTBOX MODAL --- */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-300"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-55">
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-3 bg-zinc-900/90 hover:bg-zinc-850 text-white rounded-full transition-colors border border-zinc-800 shadow-md cursor-pointer backdrop-blur"
                aria-label="Close Player"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div 
              className={`${
                videoModalSize === 'compact' ? 'max-w-2xl' :
                videoModalSize === 'cinema' ? 'max-w-6xl' :
                videoModalSize === 'immersive' ? 'max-w-none w-11/12 md:w-[94vw]' :
                'max-w-4xl'
              } w-full flex flex-col relative transition-all duration-300 ease-out py-12 sm:py-0`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Size & Aspect Adjuster controls (Anti-Black pillarboxing / Theater mode adjustment) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 p-3 sm:px-4 rounded-2xl text-xs shadow-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block font-bold">Player Size:</span>
                  <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850">
                    {(['compact', 'standard', 'cinema', 'immersive'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setVideoModalSize(sz)}
                        className={`px-3 py-1 rounded-md text-[9px] uppercase font-mono font-bold transition-all cursor-pointer ${
                          videoModalSize === sz
                            ? 'bg-red-500 text-white shadow shadow-red-500/20 font-extrabold'
                            : 'text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block font-bold">Aspect Ratio:</span>
                  <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850">
                    {(['auto', '16-9', '21-9', '4-3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setVideoAspectRatio(ratio)}
                        className={`px-3 py-1 rounded-md text-[9px] uppercase font-mono font-bold transition-all cursor-pointer ${
                          videoAspectRatio === ratio
                            ? 'bg-red-500 text-white shadow shadow-red-500/20 font-extrabold'
                            : 'text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/30'
                        }`}
                      >
                        {ratio === 'auto' ? 'Adapt / Native' : ratio.replace('-', ':')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`w-full rounded-2xl bg-zinc-980 border border-zinc-800 overflow-hidden shadow-2xl relative flex items-center justify-center ${
                videoAspectRatio === '16-9' ? 'aspect-video' :
                videoAspectRatio === '21-9' ? 'aspect-[21/9]' :
                videoAspectRatio === '4-3' ? 'aspect-[4/3]' :
                videoModalSize === 'immersive' ? 'h-auto max-h-[85vh]' :
                videoModalSize === 'cinema' ? 'h-auto max-h-[80vh]' :
                'h-auto max-h-[70vh]'
              }`}>
                {isEmbedUrl(selectedVideo.url) ? (
                  <iframe
                    src={getEmbedUrl(selectedVideo.url)}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <DynamicVideo
                    url={selectedVideo.url}
                    controls
                    autoPlay
                    className={`${
                      videoAspectRatio === 'auto' 
                        ? videoModalSize === 'immersive' ? 'w-full max-h-[85vh] object-contain' :
                          videoModalSize === 'cinema' ? 'w-full max-h-[80vh] object-contain' :
                          'w-full max-h-[70vh] object-contain'
                        : 'w-full h-full object-contain'
                    } mx-auto`}
                  />
                )}
              </div>

              {/* Video Lightbox Text descriptions */}
              <div className="text-left mt-5 bg-zinc-900/45 border border-zinc-850/50 p-5 rounded-2xl">
                <span className="text-[9px] font-mono font-bold tracking-wider text-red-500 uppercase bg-red-500/10 px-2 py-1 rounded">
                  BIOMECHANICS FEED: {selectedVideo.uploaderName}
                </span>
                <h4 className="text-white font-display font-medium text-xl leading-tight mt-2.5">
                  {selectedVideo.title}
                </h4>
                <p className="text-zinc-400 mt-2 text-sm leading-relaxed font-sans font-normal">
                  {selectedVideo.description || "No supplemental research bio logs available for this video."}
                </p>
                <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-wider block mt-4 border-t border-zinc-850 pt-3">
                  Fitness Molecule Biomechanics Suite • Published: {selectedVideo.createdAt}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --- UPLOAD WALKTHROUGH SLIDING MODAL --- */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div 
              className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/55">
                <div className="flex items-center space-x-2.5">
                  <Film className="h-5 w-5 text-red-500" />
                  <h3 className="font-display font-semibold text-lg text-white">Upload Training Walkthrough</h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors font-bold cursor-pointer"
                >
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddVideo} className="p-6 space-y-4">
                
                {/* Error Banner */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl flex items-start space-x-2 text-left">
                    <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Banner */}
                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl flex items-center space-x-2 text-left">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Video synced successfully to live Arena Feed!</span>
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="video-title" className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                    Video Title *
                  </label>
                  <input
                    id="video-title"
                    type="text"
                    required
                    placeholder="e.g., Lat-Focus Pull-Around Alignment Check"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans focus:outline-none transition-colors text-white"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="video-desc" className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                    Biomechanical Description / Notes
                  </label>
                  <textarea
                    id="video-desc"
                    placeholder="Provide alignment hints, muscle focal zones, set reps, or biomechanical goals..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2.5}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans focus:outline-none transition-colors text-white resize-none"
                  />
                </div>

                {/* Source Selection Tabs */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                    Media Source Type
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 border border-zinc-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadType('link');
                        setError(null);
                        setVideoFile(null);
                      }}
                      className={`py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                        uploadType === 'link' 
                          ? 'bg-zinc-850 text-white border border-zinc-750' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Social/Web Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadType('file');
                        setError(null);
                        setLinkUrl('');
                      }}
                      className={`py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                        uploadType === 'file' 
                          ? 'bg-zinc-850 text-white border border-zinc-750' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <FileVideo className="h-3.5 w-3.5" />
                      <span>Upload Local File</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Inputs */}
                {uploadType === 'link' ? (
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="video-url" className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                      Video Web URL / Embed Link *
                    </label>
                    <input
                      id="video-url"
                      type="url"
                      placeholder="e.g., https://www.youtube.com/watch?v=..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans focus:outline-none transition-colors text-white"
                    />
                    <span className="text-[10px] text-zinc-400 leading-normal block">
                      💡 <strong>RECOMMENDED FOR VERCEL & INTERNET:</strong> Paste any standard YouTube URL (including Shorts), Vimeo link, or public static MP4 link. These will automatically convert to safe, embeddable streaming iframes.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                      Video File Attachment *
                    </span>
                    
                    {/* DRAG AND DROP AREA */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center transition-all ${
                        isDragging 
                          ? 'border-red-500 bg-red-500/5' 
                          : videoFile 
                            ? 'border-zinc-700 bg-zinc-950/40' 
                            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/20'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      {videoFile ? (
                        <>
                          <FileVideo className="h-8 w-8 text-red-500 mb-2 animate-pulse" />
                          <p className="text-white text-xs font-medium font-mono truncate max-w-[220px]">
                            {videoFile.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1 font-normal">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                          </p>
                          <span className="text-[10px] text-red-400 hover:underline mt-2 font-bold cursor-pointer font-sans">
                            Change File
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-zinc-600 mb-2" />
                          <p className="text-zinc-300 text-xs font-semibold leading-normal font-sans">
                            Drag & drop video clip here, or <span className="text-red-500">browse file</span>
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-1.5 font-normal leading-relaxed max-w-[220px]">
                            MP4, WebM formats supported (max size 250MB for local sandbox).
                          </p>
                        </>
                      )}
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-[10px] text-amber-400 leading-normal font-sans">
                      ⚠️ <strong>NOTE:</strong> Local file uploads are stored securely inside your browser's IndexedDB engine. They are visible on this computer but will <strong>not</strong> load for other visitors on Vercel. For global distribution on the internet, please select <strong>Social/Web Link</strong> state and paste a YouTube or Vimeo clip!
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-transparent text-zinc-400 hover:text-white rounded-xl text-xs font-mono font-bold border border-transparent cursor-pointer disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-650 text-white rounded-xl text-xs font-mono font-bold cursor-pointer hover:shadow-lg hover:shadow-red-500/10 active:scale-98 flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>SYNCHRONIZING...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>SAVE TO ARENA</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- CUSTOM PHOTOGRAPH UPLOAD FORM MODAL --- */}
        {showPhotoUploadModal && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => {
              if (!photoUploading) {
                setShowPhotoUploadModal(false);
                setPhotoError(null);
                setPhotoFile(null);
                setPhotoCaption('');
                setPhotoLinkUrl('');
              }
            }}
          >
            <div 
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <div className="flex items-center space-x-2 text-red-500">
                  <Camera className="h-5 w-5" />
                  <h3 className="text-lg font-display font-semibold text-white uppercase tracking-tight">Upload Photograph</h3>
                </div>
                <button
                  onClick={() => {
                    if (!photoUploading) {
                      setShowPhotoUploadModal(false);
                      setPhotoError(null);
                      setPhotoFile(null);
                      setPhotoCaption('');
                      setPhotoLinkUrl('');
                    }
                  }}
                  className="p-1.5 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Message Overlays */}
              {photoError && (
                <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs flex items-start space-x-2 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-sans font-medium">{photoError}</p>
                </div>
              )}

              {photoSuccess && (
                <div className="mb-5 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-in slide-in-from-top-2 animate-pulse">
                  <Check className="h-4 w-4 shrink-0" />
                  <p className="font-sans font-bold">PHOTOGRAPH SYNCHRONIZED SECURELY!</p>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleAddPhoto} className="space-y-5">
                
                {/* Photo Caption */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="photo-caption" className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                    Photograph Caption / Label *
                  </label>
                  <input
                    id="photo-caption"
                    type="text"
                    placeholder="e.g., Heavy Biomechanical Leg Press Setup..."
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans focus:outline-none transition-colors text-white"
                  />
                </div>

                {/* Photo Source Selection Tabs */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                    Photo Source Type
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 border border-zinc-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUploadType('link');
                        setPhotoError(null);
                        setPhotoFile(null);
                      }}
                      className={`py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                        photoUploadType === 'link' 
                          ? 'bg-zinc-850 text-white border border-zinc-750' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Social/Web Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUploadType('file');
                        setPhotoError(null);
                        setPhotoLinkUrl('');
                      }}
                      className={`py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                        photoUploadType === 'file' 
                          ? 'bg-zinc-850 text-white border border-zinc-750' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>Upload Local Photo</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Inputs */}
                {photoUploadType === 'link' ? (
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="photo-url" className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                      Image Web URL *
                    </label>
                    <input
                      id="photo-url"
                      type="url"
                      placeholder="e.g., https://images.unsplash.com/photo-..."
                      value={photoLinkUrl}
                      onChange={(e) => setPhotoLinkUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans focus:outline-none transition-colors text-white"
                    />
                    <span className="text-[10px] text-zinc-500 leading-normal block">
                      Supports direct JPEG, PNG, WebP image links or host links.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold block">
                      Image File Attachment *
                    </span>
                    
                    {/* DRAG AND DROP AREA */}
                    <div
                      onDragOver={handlePhotoDragOver}
                      onDragLeave={handlePhotoDragLeave}
                      onDrop={handlePhotoDrop}
                      onClick={() => photoFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center transition-all ${
                        isPhotoDragging 
                          ? 'border-red-500 bg-red-500/5' 
                          : photoFile 
                            ? 'border-zinc-700 bg-zinc-950/40' 
                            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/20'
                      }`}
                    >
                      <input
                        ref={photoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileChange}
                        className="hidden"
                      />
                      
                      {photoFile ? (
                        <>
                          <ImageIcon className="h-8 w-8 text-red-500 mb-2 animate-pulse" />
                          <p className="text-white text-xs font-medium font-mono truncate max-w-[220px]">
                            {photoFile.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1 font-normal">
                            {(photoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                          </p>
                          <span className="text-[10px] text-red-400 hover:underline mt-2 font-bold cursor-pointer font-sans">
                            Change File
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-zinc-600 mb-2" />
                          <p className="text-zinc-300 text-xs font-semibold leading-normal font-sans">
                            Drag & drop image here, or <span className="text-red-500">browse file</span>
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-1.5 font-normal leading-relaxed max-w-[220px]">
                            JPEG, PNG, WebP supported (max size 15MB for fluid rendering).
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    disabled={photoUploading}
                    onClick={() => {
                      setShowPhotoUploadModal(false);
                      setPhotoError(null);
                      setPhotoFile(null);
                      setPhotoCaption('');
                      setPhotoLinkUrl('');
                    }}
                    className="px-4 py-2 bg-transparent text-zinc-400 hover:text-white rounded-xl text-xs font-mono font-bold border border-transparent cursor-pointer disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={photoUploading}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-650 text-white rounded-xl text-xs font-mono font-bold cursor-pointer hover:shadow-lg hover:shadow-red-500/10 active:scale-98 flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {photoUploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>SYNCHRONIZING...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>SAVE TO ARENA</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
