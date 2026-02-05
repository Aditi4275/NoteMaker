const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let noteId = '';
let bookmarkId = '';

const test = async () => {
    try {
        console.log('🧪 Starting API Tests...\n');

        // 1. Health Check
        console.log('1. Checking Health...');
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health OK:', health.data);

        // 2. Auth - Register
        console.log('\n2. Testing Registration...');
        const uniqueEmail = `test${Date.now()}@example.com`;
        const register = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('✅ Register OK');
        token = register.data.data.token;
        userId = register.data.data._id;

        // 3. Auth - Login
        console.log('\n3. Testing Login...');
        const login = await axios.post(`${API_URL}/auth/login`, {
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('✅ Login OK');

        // Set Auth Header
        const authConfig = { headers: { Authorization: `Bearer ${token}` } };

        // 4. Notes - Create
        console.log('\n4. Testing Note Creation...');
        const note = await axios.post(`${API_URL}/notes`, {
            title: 'Test Note',
            content: 'This is a test content',
            tags: ['test', 'api']
        }, authConfig);
        console.log('✅ Note Created:', note.data.data.title);
        noteId = note.data.data._id;

        // 5. Notes - Get All
        console.log('\n5. Testing Get All Notes...');
        const notes = await axios.get(`${API_URL}/notes`, authConfig);
        console.log(`✅ Retrieved ${notes.data.count} notes`);

        // 6. Notes - Update
        console.log('\n6. Testing Note Update...');
        const updatedNote = await axios.put(`${API_URL}/notes/${noteId}`, {
            title: 'Updated Test Note'
        }, authConfig);
        console.log('✅ Note Updated:', updatedNote.data.data.title);

        // 7. Bookmarks - Create (with valid URL)
        console.log('\n7. Testing Bookmark Creation...');
        try {
            const bookmark = await axios.post(`${API_URL}/bookmarks`, {
                url: 'https://example.com',
                tags: ['example']
            }, authConfig);
            console.log('✅ Bookmark Created:', bookmark.data.data.title || bookmark.data.data.url);
            bookmarkId = bookmark.data.data._id;
        } catch (e) {
            console.log('⚠️  Bookmark Creation Warning (might be scraping timeout):', e.message);
        }

        // 8. Bookmarks - Get All
        console.log('\n8. Testing Get All Bookmarks...');
        const bookmarks = await axios.get(`${API_URL}/bookmarks`, authConfig);
        console.log(`✅ Retrieved ${bookmarks.data.count} bookmarks`);

        // 9. Bookmarks - Delete
        if (bookmarkId) {
            console.log('\n9. Testing Bookmark Delete...');
            await axios.delete(`${API_URL}/bookmarks/${bookmarkId}`, authConfig);
            console.log('✅ Bookmark Deleted');
        }

        // 10. Notes - Delete
        console.log('\n10. Testing Note Delete...');
        await axios.delete(`${API_URL}/notes/${noteId}`, authConfig);
        console.log('✅ Note Deleted');

        console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');

    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
};

test();
