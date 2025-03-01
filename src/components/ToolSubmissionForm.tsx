
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

const toolSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  image_url: z.string().url({ message: 'Please enter a valid image URL' }).optional().or(z.literal('')),
  category_id: z.string({ required_error: 'Please select a category' }),
});

type ToolFormValues = z.infer<typeof toolSchema>;

interface ToolSubmissionFormProps {
  onClose: () => void;
}

const ToolSubmissionForm: React.FC<ToolSubmissionFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      image_url: '',
      category_id: '',
    },
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  const onSubmit = async (data: ToolFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a tool');
      return;
    }

    try {
      const { error } = await supabase
        .from('tools')
        .insert({
          name: data.name,
          description: data.description,
          url: data.url,
          image_url: data.image_url || null,
          category_id: data.category_id,
          submitted_by: user.id,
          verified: false,
          upvotes: 0,
        });

      if (error) throw error;
      
      toast.success('Tool submitted successfully! It will be reviewed by an admin.');
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting tool:', error);
      toast.error('Failed to submit tool. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Submit a New AI Tool</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ChatGPT" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the AI tool you want to add
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what this tool does and why it's useful..." 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  A clear description of the tool's features and benefits
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormDescription>
                  The official website of the tool
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...field} />
                </FormControl>
                <FormDescription>
                  URL to the tool's logo or screenshot
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  disabled={isLoadingCategories} 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the most appropriate category for this tool
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Tool</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ToolSubmissionForm;
