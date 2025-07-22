import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { supabase } from 'https://esm.sh/@supabase/supabase-js@2.52.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

// Email template for new submission notification
const NewSubmissionEmail = ({ submission }: { submission: any }) => {
  const React = (globalThis as any).React
  
  return React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' } }, [
    React.createElement('h2', { key: 'title', style: { color: '#1e293b', borderBottom: '2px solid #2563eb', paddingBottom: '10px' } }, 
      '🔌 Nouvelle demande de raccordement reçue'
    ),
    React.createElement('div', { key: 'content', style: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', margin: '20px 0' } }, [
      React.createElement('p', { key: 'intro', style: { fontSize: '16px', marginBottom: '20px' } }, 
        'Une nouvelle demande de raccordement a été soumise :'
      ),
      React.createElement('table', { key: 'details', style: { width: '100%', borderCollapse: 'collapse' } }, [
        React.createElement('tr', { key: 'nom' }, [
          React.createElement('td', { key: 'label1', style: { padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' } }, 'Nom :'),
          React.createElement('td', { key: 'value1', style: { padding: '8px', borderBottom: '1px solid #e2e8f0' } }, `${submission.prenom} ${submission.nom}`)
        ]),
        React.createElement('tr', { key: 'tel' }, [
          React.createElement('td', { key: 'label2', style: { padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' } }, 'Téléphone :'),
          React.createElement('td', { key: 'value2', style: { padding: '8px', borderBottom: '1px solid #e2e8f0' } }, submission.telephone)
        ]),
        React.createElement('tr', { key: 'email' }, [
          React.createElement('td', { key: 'label3', style: { padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' } }, 'Email :'),
          React.createElement('td', { key: 'value3', style: { padding: '8px', borderBottom: '1px solid #e2e8f0' } }, submission.email)
        ]),
        React.createElement('tr', { key: 'projet' }, [
          React.createElement('td', { key: 'label4', style: { padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' } }, 'Projet :'),
          React.createElement('td', { key: 'value4', style: { padding: '8px', borderBottom: '1px solid #e2e8f0' } }, `${submission.project_type}, ${submission.adresse}, ${submission.ville}`)
        ]),
        React.createElement('tr', { key: 'type' }, [
          React.createElement('td', { key: 'label5', style: { padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' } }, 'Type :'),
          React.createElement('td', { key: 'value5', style: { padding: '8px', borderBottom: '1px solid #e2e8f0' } }, `${submission.connection_type}, ${submission.power_type} - ${submission.power_kva} kVA`)
        ])
      ])
    ]),
    React.createElement('div', { key: 'footer', style: { textAlign: 'center', marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', color: 'white', borderRadius: '8px' } }, [
      React.createElement('p', { key: 'company', style: { margin: '0', fontWeight: 'bold' } }, 'raccordement.net'),
      React.createElement('p', { key: 'contact', style: { margin: '5px 0 0 0', fontSize: '14px' } }, '📞 09 69 32 18 00 | 📧 contact@raccordement.net')
    ])
  ])
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    
    console.log('Notification request:', { type, data })

    if (!resend) {
      console.log('RESEND_API_KEY not configured, storing notification in database')
      
      // Store in notifications table if email service not configured
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (supabaseUrl && supabaseKey) {
        const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)
        
        await supabaseClient.from('notifications').insert({
          type,
          title: getNotificationTitle(type),
          message: getNotificationMessage(type, data),
          data: data,
          email_sent: false,
          created_at: new Date().toISOString()
        })
      }

      return new Response(JSON.stringify({ success: true, stored: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Send email notification
    let emailContent = ''
    let subject = ''

    switch (type) {
      case 'new_submission':
        subject = '🔌 Nouvelle demande de raccordement - raccordement.net'
        emailContent = await renderAsync(React.createElement(NewSubmissionEmail, { submission: data }))
        break
      
      case 'new_message':
        subject = '💬 Nouveau message de contact - raccordement.net'
        emailContent = `
          <h2>💬 Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${data.name}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
          <p><strong>Type :</strong> ${data.request_type}</p>
          <p><strong>Message :</strong></p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            ${data.message || 'Demande de rappel'}
          </div>
        `
        break
      
      case 'new_payment':
        subject = '💳 Nouveau paiement reçu - raccordement.net'
        emailContent = `
          <h2>💳 Nouveau paiement reçu</h2>
          <p><strong>Montant :</strong> ${(data.amount / 100).toFixed(2)}€</p>
          <p><strong>Client :</strong> ${data.customer_name}</p>
          <p><strong>Email :</strong> ${data.customer_email}</p>
          <p><strong>Statut :</strong> ${data.status}</p>
        `
        break
        
      default:
        throw new Error(`Unknown notification type: ${type}`)
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'raccordement.net <notifications@resend.dev>',
      to: ['contact@raccordement.net'], // Replace with actual admin email
      subject,
      html: emailContent,
    })

    if (error) {
      console.error('Email send error:', error)
      throw error
    }

    console.log('Email sent successfully:', emailData)

    return new Response(JSON.stringify({ success: true, emailId: emailData?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error: any) {
    console.error('Error in notify-admin function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
})

function getNotificationTitle(type: string): string {
  switch (type) {
    case 'new_submission': return 'Nouvelle demande de raccordement'
    case 'new_message': return 'Nouveau message de contact'
    case 'new_payment': return 'Nouveau paiement reçu'
    default: return 'Nouvelle notification'
  }
}

function getNotificationMessage(type: string, data: any): string {
  switch (type) {
    case 'new_submission':
      return `${data.prenom} ${data.nom} - ${data.project_type}, ${data.ville}`
    case 'new_message':
      return `${data.name} - ${data.request_type}`
    case 'new_payment':
      return `${(data.amount / 100).toFixed(2)}€ - ${data.status}`
    default:
      return 'Nouvelle activité'
  }
}