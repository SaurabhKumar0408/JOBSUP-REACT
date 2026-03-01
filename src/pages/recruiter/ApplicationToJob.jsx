import { useState, useEffect } from 'react'
import api from '../../api'
import { useParams } from 'react-router-dom'

function ApplicationToJob() {
    const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");
    const { job_id } = useParams();
    const [job, setJob] = useState({
        id: "",
        title: "",
        company: "",
    });
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, [job_id])

    const fetchApplications = async () => {
        try {
            const res = await api.get(`/applications/viewApplicationForJobs/${job_id}/`);
            setJob(res.data.job);
            setApplications(res.data.applications);
        } catch (err) {
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, newStatus) => {
        try {
            await api.post(`/applications/changeStatus/${applicationId}/`, {
                new_status: newStatus
            });

            setApplications(prev =>
                prev.map(app =>
                    app.application_id === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            );
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <p className="text-gray-600 mt-1">
                    {job.company} • {applications.length} applications
                </p>
            </div>

            {/* Applications */}
            {applications.length === 0 ? (
                <p className="text-gray-500">No applications yet.</p>
            ) : (
                <div className="space-y-5">
                    {applications.map(app => (
                        <div
                            key={app.application_id}
                            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            {/* Top Row */}
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {app.applicant}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Applied on {app.applied_on}
                                    </p>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                    ${app.status === "applied" && "bg-blue-100 text-blue-700"}
                                    ${app.status === "shortlisted" && "bg-green-100 text-green-700"}
                                    ${app.status === "rejected" && "bg-red-100 text-red-700"}
                                `}>
                                    {app.status}
                                </span>
                            </div>

                            {/* Resume */}
                            {app.resume && (
                                <div className="mt-3">
                                    <a
                                        href={`${BASE_URL}${app.resume}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-blue-600 font-medium hover:underline"
                                    >
                                        View Resume →
                                    </a>
                                </div>
                            )}

                            {/* Cover Letter */}
                            {app.cover_letter && (
                                <div className="mt-4 text-sm text-gray-700">
                                    <p className="font-medium mb-1">
                                        Cover Letter
                                    </p>
                                    <p className="leading-relaxed">
                                        {app.cover_letter}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            {app.status === "applied" && (
                                <div className="mt-5 flex gap-3">
                                    <button
                                        onClick={() =>
                                            updateStatus(app.application_id, "shortlisted")
                                        }
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                    >
                                        Shortlist
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(app.application_id, "rejected")
                                        }
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ApplicationToJob
