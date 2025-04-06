
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Form validation schema
const formSchema = z.object({
  location: z.string().min(5, { message: 'Location must be at least 5 characters' }),
  safetyRating: z.string(),
  incidentType: z.string().optional(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }).max(500, { message: 'Description must be less than 500 characters' }),
  date: z.string().optional(),
  time: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const FeedbackForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      safetyRating: 'safe',
      incidentType: '',
      description: '',
      date: '',
      time: '',
    },
  });

  const safetyRating = form.watch('safetyRating');

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    
    // In a real app, we would submit to an API
    console.log('Submitting feedback:', values);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    form.reset();
    
    toast.success('Thank you for your feedback!', {
      description: 'Your report helps make our community safer.',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Location Safety Feedback</CardTitle>
        <CardDescription>
          Share your experiences about the safety of a location to help others stay safe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <Input 
                        placeholder="Enter address or location name" 
                        className="rounded-l-none focus:ring-primary" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Provide a specific address or location name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="safetyRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safety Rating</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a safety rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safe">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2 text-safe" />
                            <span>Safe</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="caution">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-caution" />
                            <span>Use Caution</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="unsafe">
                          <div className="flex items-center">
                            <ThumbsDown className="h-4 w-4 mr-2 text-danger" />
                            <span>Unsafe</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {safetyRating !== 'safe' && (
              <FormField
                control={form.control}
                name="incidentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Type</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select the type of incident" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theft">Theft/Robbery</SelectItem>
                          <SelectItem value="assault">Assault</SelectItem>
                          <SelectItem value="harassment">Harassment</SelectItem>
                          <SelectItem value="vandalism">Vandalism</SelectItem>
                          <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide details about your experience at this location"
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include details that would be helpful for others to know about this location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
