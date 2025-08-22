"use client";

import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

interface FormValues {
  query: string;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, placeholder = "Search...", className = "" }) => {
  const form = useForm<FormValues>({
    defaultValues: { query: "" },
  });

  const handleClear = () => {
    form.reset({ query: "" });
    onSearch("");
  };

  const onSubmit = (values: FormValues) => {
    onSearch(values.query);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`relative flex items-center ${className}`}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="relative flex-1">
              {/* Search ikona mimo FormControl */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className="pl-10 pr-10 bg-card border-border focus:ring-primary"
                />
              </FormControl>

              {field.value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" className="ml-2 bg-gradient-hero hover:shadow-glow transition-smooth">
          Search
        </Button>
      </form>
    </Form>
  );
};

export default SearchBar;
