
'use client';

import { Loader2 } from "lucide-react";

export function FullPageLoader() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="animate-spin h-16 w-16 text-primary" />
        </div>
    );
}
