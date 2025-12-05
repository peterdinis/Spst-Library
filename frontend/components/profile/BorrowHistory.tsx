"use client";

import { FC } from 'react';
import { BorrowRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface BorrowHistoryProps {
    borrows: BorrowRecord[];
    onReturn?: (borrowId: string) => Promise<void>;
}

const BorrowHistory: FC<BorrowHistoryProps> = ({ borrows, onReturn }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="info">Aktívne</Badge>;
            case 'returned':
                return <Badge variant="success">Vrátené</Badge>;
            case 'overdue':
                return <Badge variant="destructive">Po termíne</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (borrows.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">Zatiaľ nemáte žiadne výpožičky</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {borrows.map((borrow, index) => (
                <motion.div
                    key={borrow.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                {borrow.bookCoverUrl && (
                                    <img
                                        src={borrow.bookCoverUrl}
                                        alt={borrow.bookTitle}
                                        className="w-20 h-28 object-cover rounded-md"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg">{borrow.bookTitle}</h3>
                                            {getStatusBadge(borrow.status)}
                                        </div>
                                        {borrow.status === 'active' && onReturn && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onReturn(borrow.id)}
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Vrátiť
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Vypožičané: {formatDate(borrow.borrowDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Termín vrátenia: {formatDate(borrow.dueDate)}</span>
                                        </div>
                                        {borrow.returnDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Vrátené: {formatDate(borrow.returnDate)}</span>
                                            </div>
                                        )}
                                        {borrow.status === 'active' && (
                                            <div className="mt-2">
                                                <span className="text-xs">
                                                    {formatDistanceToNow(new Date(borrow.dueDate), {
                                                        addSuffix: true,
                                                        locale: sk,
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {borrow.notes && (
                                        <p className="mt-2 text-sm text-muted-foreground italic">
                                            {borrow.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default BorrowHistory;
