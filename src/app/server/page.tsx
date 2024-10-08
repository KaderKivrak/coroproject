
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export default function ServerUploadPage() {

    async function upload(data: FormData) {
        'use server'

        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            throw new Error('no file found');
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure the uploads directory exists
        const uploadDir = join(process.cwd(), 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const path = join(uploadDir, file.name);
        await writeFile(path, buffer);
        console.log(`open ${path} to see uploaded file`);

        return NextResponse.json({ success: true });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        
        try {
            await upload(formData); // Call the server-side upload function
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('File upload failed.');
        }
    }

    return (
        <main>
            <h1>React Server Component Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" name="file" required />
                <input type="submit" value="Upload" />
            </form>
        </main>
    );
}
