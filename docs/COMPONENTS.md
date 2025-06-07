# UI Components

This document outlines the UI components used in the Prayer App and their usage.

## Component Library

The application uses a combination of custom components and Radix UI primitives. All components are built with accessibility and reusability in mind.

## Core Components

### Button (`components/ui/button.tsx`)

A customizable button component with multiple variants and sizes.

**Variants:**
- `default`: Primary button
- `destructive`: For destructive actions
- `outline`: Bordered button
- `ghost`: Minimal button
- `link`: Link-style button

**Sizes:**
- `default`: Standard size
- `sm`: Small size
- `lg`: Large size
- `icon`: Square icon button

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="default">
  Click me
</Button>
```

### Input (`components/ui/input.tsx`)

A styled input component.

**Usage:**
```tsx
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Enter your prayer" />
```

### Textarea (`components/ui/textarea.tsx`)

A styled textarea component.

**Usage:**
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Enter your prayer here..." />
```

## Layout Components

### Container (`components/layout/container.tsx`)
A responsive container that centers content and applies consistent padding.

### Header (`components/layout/header.tsx`)
The main header component containing the app title and navigation.

## Form Components

### Form (`components/ui/form.tsx`)
A wrapper around React Hook Form with Zod validation.

**Usage:**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  prayer: z.string().min(1, 'Prayer is required'),
});

function PrayerForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prayer: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="prayer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Prayer</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your prayer..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Theme and Styling

### Colors
- Uses CSS variables for theming
- Supports light and dark modes
- Accessible color contrast ratios

### Spacing
- Consistent spacing scale based on Tailwind's default
- Responsive spacing utilities

### Typography
- System font stack
- Responsive typography scale
- Accessible text contrast
