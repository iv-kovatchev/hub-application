using System.Reflection;

public static class PropertyUpdater
{
    /// <summary>
    /// Copies all non-null properties from source to target.
    /// Only sets values that are different.
    /// Returns true if any values were changed.
    /// </summary>
    public static bool ApplyChanges<TSource, TTarget>(TSource source, TTarget target)
    {
        bool changed = false;

        foreach (var sourceProp in typeof(TSource).GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            var newValue = sourceProp.GetValue(source);
            if (newValue is null) continue;

            var targetProp = typeof(TTarget).GetProperty(sourceProp.Name);
            if (targetProp == null || !targetProp.CanWrite) continue;

            var currentValue = targetProp.GetValue(target);
            if (!Equals(currentValue, newValue))
            {
                targetProp.SetValue(target, newValue);
                changed = true;
            }
        }

        return changed;
    }
}