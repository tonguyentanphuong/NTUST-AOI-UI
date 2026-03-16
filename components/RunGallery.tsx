import React, { useEffect, useState } from 'react';
import { inspectionService } from '../services/inspectionService';
import { InspectionStatus, RunDetail, CapturedImage } from '../types';
import { ImageViewer } from './ImageViewer';

export const RunGallery = ({ runId, onEdit, onBack }: { runId: string, onEdit: (runId: string) => void, onBack: () => void }) => {
    const [detail, setDetail] = useState<RunDetail | null>(null);
    const [selectedImage, setSelectedImage] = useState<CapturedImage | null>(null);

    useEffect(() => {
        inspectionService.getRunDetail(runId).then(setDetail);
    }, [runId]);

    const handleImageUpdate = (updatedImage: CapturedImage) => {
        if (!detail) return;
        setDetail({
            ...detail,
            images: detail.images.map(img => img.id === updatedImage.id ? updatedImage : img)
        });
        setSelectedImage(updatedImage);
    };

    const formatTimestamp = (ts: string) => {
        try {
            const date = new Date(ts);
            return date.toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } catch (e) {
            return ts;
        }
    };

    if (!detail) return <div className="p-10">Loading Details...</div>;

    return (
        <div className="flex flex-1 w-full max-w-[1600px] mx-auto h-[calc(100vh-65px)] overflow-hidden">
            {/* Sidebar Metadata */}
            <aside className="hidden lg:flex flex-col w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shrink-0 h-full overflow-y-auto">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex gap-4 items-start">
                        <div className="bg-slate-200 rounded-lg size-16 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${detail.images[0]?.imageUrl})` }}></div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">{detail.runId}</h1>
                            <p className="text-slate-500 text-sm mt-1">{detail.batchId} - {detail.line}</p>
                            <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 w-fit">
                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                Attention Needed
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => onEdit(runId)} className="flex items-center justify-center gap-3 px-3 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors w-full shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            <span className="text-sm font-medium">Edit Run Statuses</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-slate-900 dark:text-white text-base font-bold">Run Details</h3>
                    <div className="grid grid-cols-[1fr_auto] gap-y-4 text-sm">
                        {[
                            ['Start Time', formatTimestamp(detail.startTime)],
                            ['End Time', formatTimestamp(detail.endTime)],
                            ['Total Boards', detail.totalBoards],
                            ['Operator', detail.operator]
                        ].map(([label, val]) => (
                            <React.Fragment key={label as string}>
                                <div className="border-t border-slate-100 dark:border-slate-700 col-span-2 pt-3 flex justify-between">
                                    <p className="text-slate-500">{label as string}</p>
                                    <p className="text-slate-900 dark:text-white font-medium">{val}</p>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* Illumination row */}
                        <div className="border-t border-slate-100 dark:border-slate-700 col-span-2 pt-3 flex justify-between items-center">
                            <p className="text-slate-500">Illumination</p>
                            <div className="flex gap-1">
                                {['L', 'R', 'T', 'B'].map(code => {
                                    const activeChars = detail.illumination?.includes(',')
                                        ? detail.illumination.split(',').map(s => s.trim().toUpperCase())
                                        : detail.illumination?.toUpperCase().split('').filter(s => s.trim()) || [];
                                    const isActive = activeChars.includes(code);
                                    return (
                                        <span key={code} className={`size-5 flex items-center justify-center rounded text-[10px] font-black border ${isActive
                                                ? 'bg-primary border-primary text-white shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'
                                            }`}>
                                            {code}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-col flex-1 bg-background-light dark:bg-background-dark min-w-0 overflow-y-auto">
                <div className="px-6 py-6 md:px-10">
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={onBack} className="text-slate-500 hover:text-primary text-sm font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Runs
                        </button>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-900 dark:text-white text-sm font-medium">{detail.runId}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h3 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Captured Images</h3>
                        <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                            <button className="px-4 py-1.5 rounded text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm">All</button>
                            <button className="px-4 py-1.5 rounded text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Failures Only</button>
                            <button className="px-4 py-1.5 rounded text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Passed</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                        {detail.images.map((img) => {
                            const isFail = img.status === InspectionStatus.FAIL;
                            const borderColor = isFail ? 'border-red-200 ring-2 ring-red-100 dark:border-red-900 dark:ring-red-900/20' : 'border-slate-200 dark:border-slate-700';

                            return (
                                <div
                                    key={img.id}
                                    onClick={() => setSelectedImage(img)}
                                    className={`group flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border ${borderColor} hover:shadow-lg transition-all cursor-pointer`}
                                >
                                    <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${img.imageUrl})` }}></div>
                                        {isFail && <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply"></div>}

                                        <div className="absolute top-2 right-2">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${isFail ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                <span className="material-symbols-outlined text-[14px]">{isFail ? 'cancel' : 'check_circle'}</span>
                                                {img.status}
                                            </span>
                                        </div>

                                        {isFail && img.label && (
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/20 truncate">
                                                    {img.label}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`p-3 border-t flex justify-between items-center ${isFail ? 'bg-red-50/30 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                                        <div>
                                            <p className={`text-xs font-semibold uppercase tracking-wider ${isFail ? 'text-red-700/70' : 'text-slate-500'}`}>Position</p>
                                            <p className={`font-bold text-lg ${isFail ? 'text-red-900 dark:text-red-100' : 'text-slate-900 dark:text-white'}`}>{img.position}</p>
                                        </div>
                                        <span className={`material-symbols-outlined ${isFail ? 'text-red-400' : 'text-slate-400'}`}>visibility</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {selectedImage && (
                <ImageViewer
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                    onUpdate={handleImageUpdate}
                />
            )}
        </div>
    );
};