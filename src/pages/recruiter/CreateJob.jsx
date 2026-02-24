import { useState, useEffect } from 'react'
import api from '../../api'
import { useParams, useNavigate } from 'react-router-dom';

function CreateJob() {
    const {company_id} = useParams();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        company_id: "",
        description: "",
        skills_required: "",
        min_salary: "",
        max_salary: "",
        location: "",
        job_type: "",
        application_deadline: "",
    });
    

    useEffect(()=>{
        const fetchCompanies = async()=>{
            if(!company_id){
                try {
                    const res = await api.get("/jobs/myCompanies/");
                    setCompanies(res.data.companies);
                } catch (err){
                    console.error(err.response?.data);
                }
            }else{
                try{
                    const res = await api.get(`/jobs/company/${company_id}`);
                    setCompanies([res.data.company]);
                } catch(err){
                    console.error(err);
                }
            }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
    if (company_id) {
        setFormData(prev => ({
            ...prev,
            company_id: company_id
        }));
    }
}, [company_id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        setSuccess(null)
        setLoading(true);
        const payload = {
            ...formData,
            skills_required: formData.skills_required
                .split(',')
                .map(skill => skill.trim())
        };
        try{
            await api.post('/jobs/createJob/', payload);
            setSuccess("Job created successfully");
            setFormData({
                title: "",
                company_id: "",
                description: "",
                skills_required: "",
                min_salary: "",
                max_salary: "",
                location: "",
                job_type: "",
                application_deadline: "",
            });
            navigate('/recruiter/myJobs')
        }catch(err) {
            setError(err.response?.data?.error || "Failed to create Job");
        }finally{
            setLoading(false);
        }
    }

  return (
    <>
    <div className='max-w-3xl mx-auto p-6 bg-white shadow rounded'>
        <h2 className='text-2xl font-bold mb-6'>Create Job </h2>
        {error && (
            <div className='bg-red-100 text-red-700 p-2 mb-4 rounded'>
                {error}
            </div>
        )}
        {success && (
            <div className='bg-green-100 text-green-700 p-2 mb-4 rounded'>
                {success}
            </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
            <input 
                type="text"
                name='title'
                placeholder='Job Title'
                value={formData.title}
                onChange={handleChange}
                className='w-full border p-2 rounded'
                required
                
            />
            
            <select 
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                required
                disabled = {company_id}
                className={` w-full border p-2 rounded ${
                    company_id ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                
                >
                    {companies.length === 1 ? (
                        <option value={company_id} >{companies[0].name}</option>
                    ):(
                        <>
                        <option value="">Select Company</option>
                        {companies.map((c)=>(
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                        </>
                    )}
            </select>

            <textarea 
                name="description"
                placeholder='Job Description'
                value={formData.description}
                onChange={handleChange}
                className='w-full border p-2 rounded'
                rows={4}
                required 
            />

            <input 
                type="text"
                name='skills_required'
                placeholder='Skills (comma seperated)'
                value={formData.skills_required}
                onChange={handleChange}
                className='w-full border p-2 rounded'
                required
            />

            <div className='flex gap-4'>
                <input 
                    type="number" 
                    name='min_salary'
                    placeholder='Min Salary'
                    value={formData.min_salary}
                    onChange={handleChange}
                    className='w-full border p-2 rounded'
                    required
                />
                <input 
                    type="number" 
                    name='max_salary'
                    placeholder='Max Salary'
                    value={formData.max_salary}
                    onChange={handleChange}
                    className='w-full border p-2 rounded'
                    required
                />
            </div>

            <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />
            <select 
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className='w-full border p-2 rounded'
                required
            >
                <option value="">Select Job Type</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
            </select>

             <input
                type="date"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                {loading ? "Creating..." : "Create Job"}
            </button>

        </form>
        
    </div>
      
    </>
  )
}

export default CreateJob
