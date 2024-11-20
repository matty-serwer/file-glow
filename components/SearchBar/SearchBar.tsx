import { z } from "zod";

import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

const formSchema = z.object({
  query: z.string().min(1).max(200),
});


const SearchBar = ({ setQuery, query }: { setQuery: Dispatch<SetStateAction<string>>, query: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: query,
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.query === '') {
        setQuery('');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setQuery]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Input {...field} placeholder="Search Files..." />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          <Button type="submit">
            {form.formState.isSubmitting && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            <SearchIcon className="w-4 h-4 mr-2" /> Search
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default SearchBar