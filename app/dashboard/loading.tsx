import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-6">
            {/* Stats Cards Loading */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Appointments & Today's Schedule Loading */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="space-y-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1 flex-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-28" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
