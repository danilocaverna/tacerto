using System;
namespace UnityEngine.SaveSystem {
    [Serializable]
    public class BooleanVariable : IBaseVariable {
        bool _value;
        public System.Object value {
            get {
                return (System.Object) _value;
            }
            set {
                _value = (bool) value;
            }
        }
    }
}