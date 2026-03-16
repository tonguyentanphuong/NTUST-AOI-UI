import React, { useState } from 'react';
import { RunList } from './components/RunList';
import { RunGallery } from './components/RunGallery';
import { EditRun } from './components/EditRun';
import { NewInspection } from './components/NewInspection';
import { IMAGES } from './services/mockData';

enum View {
    RUN_LIST = 'RUN_LIST',
    RUN_DETAIL = 'RUN_DETAIL',
    RUN_EDIT = 'RUN_EDIT',
    NEW_INSPECTION = 'NEW_INSPECTION'
}

const Sidebar = ({ currentView, onChangeView }: { currentView: View, onChangeView: (v: View) => void }) => {
    const NavItem = ({ view, icon, label }: { view: View, icon: string, label: string }) => {
        const isActive = currentView === view || (view === View.RUN_LIST && [View.RUN_DETAIL, View.RUN_EDIT].includes(currentView));
        return (
            <button
                onClick={() => onChangeView(view)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg group transition-colors w-full ${isActive ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
                <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-slate-900 dark:text-slate-300 group-hover:text-primary'}`}>{icon}</span>
                <p className={`text-sm font-medium leading-normal ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-slate-300'}`}>{label}</p>
            </button>
        );
    };

    return (
        <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-4 hidden md:flex">
            <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-center mb-6">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">center_focus_strong</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal truncate">AOI System V4</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal truncate">Line 1 - PCB Insp.</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    <NavItem view={View.RUN_LIST} icon="dashboard" label="Dashboard" />
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 group transition-colors w-full">
                        <span className="material-symbols-outlined text-slate-900 dark:text-slate-300 group-hover:text-primary">settings</span>
                        <p className="text-slate-900 dark:text-slate-300 text-sm font-medium leading-normal">Settings</p>
                    </button>
                </nav>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0" style={{ backgroundImage: `url(${IMAGES.userAvatar})` }}></div>
                <div className="flex flex-col">
                    <p className="text-slate-900 dark:text-white text-sm font-medium">Operator 1</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Logged in</p>
                </div>
            </div>
        </aside>
    );
};

export default function App() {
    const [currentView, setCurrentView] = useState<View>(View.RUN_LIST);
    const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

    const handleViewDetail = (id: string) => {
        setSelectedRunId(id);
        setCurrentView(View.RUN_DETAIL);
    };

    const handleEditRun = (id: string) => {
        setSelectedRunId(id);
        setCurrentView(View.RUN_EDIT);
    };

    const renderContent = () => {
        switch (currentView) {
            case View.RUN_LIST:
                return <RunList onViewDetail={handleViewDetail} onCreate={() => setCurrentView(View.NEW_INSPECTION)} />;
            case View.RUN_DETAIL:
                return selectedRunId
                    ? <RunGallery runId={selectedRunId} onEdit={handleEditRun} onBack={() => setCurrentView(View.RUN_LIST)} />
                    : <RunList onViewDetail={handleViewDetail} onCreate={() => setCurrentView(View.NEW_INSPECTION)} />;
            case View.RUN_EDIT:
                return selectedRunId
                    ? <EditRun runId={selectedRunId} onSave={() => setCurrentView(View.RUN_DETAIL)} onCancel={() => setCurrentView(View.RUN_DETAIL)} />
                    : <RunList onViewDetail={handleViewDetail} onCreate={() => setCurrentView(View.NEW_INSPECTION)} />;
            case View.NEW_INSPECTION:
                return <NewInspection onSave={() => setCurrentView(View.RUN_LIST)} onCancel={() => setCurrentView(View.RUN_LIST)} />;
            default:
                return <RunList onViewDetail={handleViewDetail} onCreate={() => setCurrentView(View.NEW_INSPECTION)} />;
        }
    };

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {currentView !== View.RUN_EDIT && <Sidebar currentView={currentView} onChangeView={setCurrentView} />}
            {renderContent()}
        </div>
    );
}