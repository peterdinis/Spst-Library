"use client";

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormData, categorySchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
    initialData?: Partial<CategoryFormData> & { id?: string };
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const CategoryForm: FC<CategoryFormProps> = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || {
            name: '',
            description: '',
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData?.id ? 'Upraviť kategóriu' : 'Pridať novú kategóriu'}</CardTitle>
                <CardDescription>
                    {initialData?.id ? 'Upravte informácie o kategórii' : 'Vyplňte informácie o novej kategórii'}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Názov kategórie *</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Napríklad: Sci-Fi"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Popis *</Label>
                        <textarea
                            id="description"
                            {...register('description')}
                            placeholder="Stručný popis kategórie..."
                            className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="flex-1"
                    >
                        {(isSubmitting || isLoading) && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {initialData?.id ? 'Uložiť zmeny' : 'Pridať kategóriu'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting || isLoading}
                    >
                        Zrušiť
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default CategoryForm;
