import { useState, useEffect } from 'react';
import { toast } from "sonner";

export interface Lead {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  status?: string;
  created_at: string;
  source?: string;
  service?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  request_type: string;
}

export const useCRMData = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      console.log('CRM data fetching disabled - database schema not ready');
      setLeads([]);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      setError(error?.message || 'Failed to fetch leads');
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      console.log('Messages fetching disabled - database schema not ready');
      setMessages([]);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError(error?.message || 'Failed to fetch messages');
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      console.log('Lead status update disabled - database schema not ready');
      toast.info("Lead status update not yet implemented");
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    }
  };

  const assignLead = async (leadId: string, email: string) => {
    try {
      console.log('Lead assignment disabled - database schema not ready');
      toast.info("Lead assignment not yet implemented");
    } catch (error: any) {
      console.error('Error assigning lead:', error);
      toast.error('Failed to assign lead');
    }
  };

  const addNote = async (leadId: string, content: string) => {
    try {
      console.log('Note addition disabled - database schema not ready');
      toast.info("Note addition not yet implemented");
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchMessages();
  }, []);

  const refetch = () => {
    fetchLeads();
    fetchMessages();
  };

  return {
    leads,
    messages,
    loading,
    error,
    refetch,
    updateLeadStatus,
    assignLead,
    addNote,
  };
};