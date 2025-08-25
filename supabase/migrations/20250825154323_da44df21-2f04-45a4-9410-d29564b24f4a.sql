-- Update the main admin check function to use the safe version
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (
    is_session_valid() AND
    is_current_user_admin_safe()
  );
END;
$function$;