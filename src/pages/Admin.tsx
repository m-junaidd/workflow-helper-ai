
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { isUserAdmin } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const toolSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  category_id: z.string().min(1, { message: 'Please select a category' }),
  image_url: z.string().optional(),
  is_verified: z.boolean().default(false),
});

const categorySchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters' }),
  description: z.string().optional(),
});

type ToolFormValues = z.infer<typeof toolSchema>;
type CategoryFormValues = z.infer<typeof categorySchema>;

const Admin: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pendingTools, setPendingTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isAdminConfirmed, setIsAdminConfirmed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const toolForm = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      category_id: '',
      image_url: '',
      is_verified: false,
    },
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdminConfirmed) {
      fetchData();
    }
  }, [isAdminConfirmed]);

  useEffect(() => {
    if (selectedTool) {
      toolForm.reset({
        name: selectedTool.name,
        description: selectedTool.description,
        url: selectedTool.url,
        category_id: selectedTool.category_id || '',
        image_url: selectedTool.image_url || '',
        is_verified: selectedTool.is_verified || false,
      });
    } else {
      toolForm.reset({
        name: '',
        description: '',
        url: '',
        category_id: '',
        image_url: '',
        is_verified: false,
      });
    }
  }, [selectedTool]);

  useEffect(() => {
    if (selectedCategory) {
      categoryForm.reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description || '',
      });
    } else {
      categoryForm.reset({
        name: '',
        slug: '',
        description: '',
      });
    }
  }, [selectedCategory]);

  const checkAdminStatus = async () => {
    if (!user) {
      toast.error("Please sign in to access admin panel");
      navigate('/auth');
      return;
    }

    try {
      const isAdmin = await isUserAdmin(user.id);
      
      if (!isAdmin) {
        toast.error("You don't have permission to access the admin panel");
        navigate('/');
        return;
      }

      setIsAdminConfirmed(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error("Failed to verify admin status");
      navigate('/');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch verified tools
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools')
        .select(`
          *,
          categories(name)
        `)
        .eq('is_verified', true)
        .order('created_at', { ascending: false });

      if (toolsError) throw toolsError;
      setTools(toolsData || []);

      // Fetch pending tools
      const { data: pendingData, error: pendingError } = await supabase
        .from('tools')
        .select(`
          *,
          categories(name)
        `)
        .eq('is_verified', false)
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingTools(pendingData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const onToolSubmit = async (values: ToolFormValues) => {
    try {
      if (selectedTool) {
        // Update existing tool
        const { error } = await supabase
          .from('tools')
          .update(values)
          .eq('id', selectedTool.id);

        if (error) throw error;
        toast.success('Tool updated successfully');
      } else {
        // Create new tool
        const { error } = await supabase
          .from('tools')
          .insert({
            ...values,
            created_by: user?.id
          });

        if (error) throw error;
        toast.success('Tool created successfully');
      }

      setIsToolDialogOpen(false);
      setSelectedTool(null);
      fetchData();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error('Failed to save tool');
    }
  };

  const onCategorySubmit = async (values: CategoryFormValues) => {
    try {
      if (selectedCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(values)
          .eq('id', selectedCategory.id);

        if (error) throw error;
        toast.success('Category updated successfully');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert(values);

        if (error) throw error;
        toast.success('Category created successfully');
      }

      setIsCategoryDialogOpen(false);
      setSelectedCategory(null);
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleVerifyTool = async (id: string, verify: boolean) => {
    try {
      const { error } = await supabase
        .from('tools')
        .update({ is_verified: verify })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(verify ? 'Tool approved and published' : 'Tool rejected');
      fetchData();
    } catch (error) {
      console.error('Error updating tool verification status:', error);
      toast.error('Failed to update tool status');
    }
  };

  const deleteTool = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTools(tools.filter(tool => tool.id !== id));
      setPendingTools(pendingTools.filter(tool => tool.id !== id));
      toast.success('Tool deleted successfully');
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter(category => category.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (!isAdminConfirmed) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Verified Tools</CardTitle>
              <CardDescription>All published tools</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-primary">
              {isLoading ? <Skeleton className="h-10 w-16" /> : tools.length}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Tools</CardTitle>
              <CardDescription>Submissions needing review</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-yellow-500">
              {isLoading ? <Skeleton className="h-10 w-16" /> : pendingTools.length}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Categories</CardTitle>
              <CardDescription>Total categories</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-blue-500">
              {isLoading ? <Skeleton className="h-10 w-16" /> : categories.length}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="tools">Verified Tools</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Tools Pending Approval</h2>
            </div>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-16 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTools.length > 0 ? (
                      pendingTools.map((tool) => (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>{tool.categories?.name || 'Uncategorized'}</TableCell>
                          <TableCell>{new Date(tool.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedTool(tool);
                                setIsToolDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleVerifyTool(tool.id, true)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => deleteTool(tool.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                          No pending tools to review
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tools">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Verified Tools</h2>
              
              <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedTool(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Tool
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{selectedTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
                  </DialogHeader>
                  <Form {...toolForm}>
                    <form onSubmit={toolForm.handleSubmit(onToolSubmit)} className="space-y-4 py-4">
                      <FormField
                        control={toolForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Tool name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={toolForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tool description" {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={toolForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={toolForm.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={toolForm.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={toolForm.control}
                        name="is_verified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Verified</FormLabel>
                              <p className="text-sm text-gray-500">
                                Mark this tool as verified to make it public
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2 mt-6">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsToolDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {selectedTool ? 'Update Tool' : 'Add Tool'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-16 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Upvotes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tools.length > 0 ? (
                      tools.map((tool) => (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>{tool.categories?.name || 'Uncategorized'}</TableCell>
                          <TableCell>{tool.upvotes}</TableCell>
                          <TableCell className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedTool(tool);
                                setIsToolDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(tool.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Visit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the tool.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteTool(tool.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                          No tools found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Categories</h2>
              
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedCategory(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                  </DialogHeader>
                  <Form {...categoryForm}>
                    <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4 py-4">
                      <FormField
                        control={categoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Category name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={categoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="category-slug" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={categoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Category description" {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2 mt-6">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsCategoryDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {selectedCategory ? 'Update Category' : 'Add Category'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-16 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsCategoryDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the category
                                    and potentially affect tools associated with it.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteCategory(category.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                          No categories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
