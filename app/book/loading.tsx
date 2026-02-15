import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingLoading() {
    return (
        <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step indicator loading */}
                    <div className="flex justify-between mb-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </div>

                    {/* Form content loading */}
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Buttons loading */}
                    <div className="flex justify-between pt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
